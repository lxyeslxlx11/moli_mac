// Independent offline analysis helper. Entry addresses must come from retained code-pointer evidence.
// This creates metadata only in an expendable Ghidra project; it never launches or writes the target.
//@category Moli.Analysis
import ghidra.app.script.GhidraScript;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.framework.Application;
import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.Reference;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import com.google.gson.GsonBuilder;

public class ExportCallbackDossiers extends GhidraScript {
    private String hex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte value : bytes) result.append(String.format("%02x", value & 255));
        return result.toString();
    }
    private String addr(Address address) { return "0x" + address.toString().replaceFirst("^0+(?!$)", ""); }
    private Map<String,Object> row(Object... fields) {
        Map<String,Object> result = new LinkedHashMap<>();
        for (int i=0; i<fields.length; i+=2) result.put((String) fields[i], fields[i+1]);
        return result;
    }
    public void run() throws Exception {
        String[] args = getScriptArgs();
        if (args.length != 3) throw new IllegalArgumentException("output.json expected_sha256 code-pointer-entry-csv required");
        Path output = Path.of(args[0]);
        if (!output.isAbsolute() || Files.exists(output)) throw new IllegalArgumentException("new absolute output path required");
        Path input = Path.of(currentProgram.getExecutablePath());
        String sha = hex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(input)));
        if (!sha.equals(args[1])) throw new IllegalStateException("source SHA-256 differs");
        DecompInterface decompiler = new DecompInterface();
        List<Object> results = new ArrayList<>();
        try {
            if (!decompiler.openProgram(currentProgram)) throw new IllegalStateException("decompiler cannot open program");
            for (String text : args[2].split(",")) {
                Address entry = toAddr(text);
                Function function = getFunctionAt(entry);
                boolean defined = function == null;
                if (defined) {
                    if (getFunctionContaining(entry) != null) throw new IllegalStateException("entry overlaps existing function: " + text);
                    disassemble(entry);
                    function = createFunction(entry, "callback_" + text.replace("0x", ""));
                }
                if (function == null) throw new IllegalStateException("cannot define callback: " + text);
                DecompileResults decompiled = decompiler.decompileFunction(function, 120, monitor);
                if (!decompiled.decompileCompleted() || decompiled.getDecompiledFunction() == null)
                    throw new IllegalStateException("decompilation incomplete: " + text + " " + decompiled.getErrorMessage());
                List<Object> ranges = new ArrayList<>();
                AddressRangeIterator rangeIterator = function.getBody().getAddressRanges();
                while (rangeIterator.hasNext()) {
                    AddressRange range = rangeIterator.next();
                    ranges.add(row("start",addr(range.getMinAddress()),"end",addr(range.getMaxAddress()),"bytes",range.getLength()));
                }
                List<Object> instructions = new ArrayList<>();
                InstructionIterator iterator = currentProgram.getListing().getInstructions(function.getBody(),true);
                while (iterator.hasNext()) {
                    Instruction instruction = iterator.next();
                    List<String> flows = new ArrayList<>();
                    for (Address target : instruction.getFlows()) flows.add(addr(target));
                    List<Object> refs = new ArrayList<>();
                    for (Reference reference : instruction.getReferencesFrom())
                        refs.add(row("target",addr(reference.getToAddress()),"type",reference.getReferenceType().toString()));
                    instructions.add(row("address",addr(instruction.getAddress()),"bytes",hex(instruction.getBytes()),"text",instruction.toString(),"flow",instruction.getFlowType().toString(),"destinations",flows,"references",refs));
                }
                List<String> callees = new ArrayList<>();
                for (Function callee : function.getCalledFunctions(monitor)) callees.add(addr(callee.getEntryPoint()));
                Collections.sort(callees);
                results.add(row("entry",addr(entry),"analyst_defined_entry",defined,"name",function.getName(),"signature",function.getSignature().toString(),"ranges",ranges,"body_bytes",function.getBody().getNumAddresses(),"instructions",instructions,"callees",callees,"pseudocode",decompiled.getDecompiledFunction().getC(),"decompiler_message",decompiled.getErrorMessage()));
            }
        } finally { decompiler.dispose(); }
        Map<String,Object> result = row("schema","moli.independent-callback-dossiers.v1","classification","derived-static-analysis-from-explicit-code-pointer-entries","source",row("path",input.toString(),"bytes",Files.size(input),"sha256",sha),"tool",row("name","Ghidra headless plus project-owned ExportCallbackDossiers","version",Application.getApplicationVersion(),"language",currentProgram.getLanguageID().toString()),"target_executed",false,"source_written",false,"functions",results,"limitations",List.of("Entry points are analyst-supplied from retained source pointers, not a new native provider inventory.","Pseudocode is decompiler output; original-byte and instruction cross-checks are required.","No original runtime, menu, wire exchange or whole-input completion is established by this export."));
        Files.writeString(output,new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create().toJson(result)+"\n",StandardCharsets.UTF_8,StandardOpenOption.CREATE_NEW);
        println("MOLI_CALLBACK_EXPORT functions=" + results.size() + " sha256=" + sha);
    }
}
