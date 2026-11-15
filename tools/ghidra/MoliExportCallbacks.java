// Export explicitly evidenced callback entries from an independent analysis copy.
// Original program bytes are never executed or patched. Function boundaries are
// analyst-seeded Ghidra derivations, not a replacement for canonical REA evidence.
// @category Moli.Static
import ghidra.app.script.GhidraScript;
import ghidra.app.cmd.function.CreateFunctionCmd;
import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.program.model.address.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.symbol.SourceType;
import com.google.gson.GsonBuilder;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class MoliExportCallbacks extends GhidraScript {
    private List<Map<String,Object>> ranges(AddressSetView set) {
        List<Map<String,Object>> out = new ArrayList<>();
        AddressRangeIterator it = set.getAddressRanges(true);
        while (it.hasNext()) {
            AddressRange r = it.next(); Map<String,Object> row = new LinkedHashMap<>();
            row.put("start", r.getMinAddress().toString()); row.put("end", r.getMaxAddress().toString());
            row.put("bytes", r.getLength()); out.add(row);
        }
        return out;
    }
    private String hex(byte[] bytes) {
        StringBuilder s = new StringBuilder();
        for (byte b : bytes) s.append(String.format("%02x", b & 255));
        return s.toString();
    }
    @Override public void run() throws Exception {
        String[] args = getScriptArgs();
        if (args.length < 2) throw new IllegalArgumentException("Output JSON and explicit evidenced entry addresses required.");
        Path output = Paths.get(args[0]).toAbsolutePath();
        if (Files.exists(output)) throw new IllegalArgumentException("Output already exists.");
        Map<String,Object> report = new LinkedHashMap<>();
        report.put("schema", "moli.derived-ghidra-callbacks.v1");
        report.put("authority", "analyst-seeded static analysis; original bytes and source pointers require separate verification");
        report.put("originalExecution", false); report.put("originalBytePatches", false);
        report.put("imageBase", currentProgram.getImageBase().toString());
        report.put("language", currentProgram.getLanguageID().toString());
        report.put("compiler", currentProgram.getCompilerSpec().getCompilerSpecID().toString());
        List<Map<String,Object>> rows = new ArrayList<>(); report.put("entries", rows);
        FunctionManager manager = currentProgram.getFunctionManager();
        DecompInterface decompiler = new DecompInterface();
        if (!decompiler.openProgram(currentProgram)) throw new IllegalStateException("Decompiler did not open the analysis copy.");
        try {
            for (int i = 1; i < args.length; i++) {
                monitor.checkCancelled(); Address entry = toAddr(args[i]);
                Map<String,Object> row = new LinkedHashMap<>(); rows.add(row); row.put("requestedEntry", entry.toString());
                Function before = manager.getFunctionAt(entry), containing = manager.getFunctionContaining(entry);
                row.put("functionExistedBeforeSeed", before != null);
                row.put("beforeBody", before == null ? null : ranges(before.getBody()));
                if (containing != null && before == null) {
                    row.put("status", "refused-overlap"); row.put("containingEntry", containing.getEntryPoint().toString()); continue;
                }
                row.put("disassembled", disassemble(entry));
                CreateFunctionCmd command = new CreateFunctionCmd("MoliObserved_" + entry, entry, null, SourceType.USER_DEFINED, false, true);
                row.put("createOrRecreateApplied", command.applyTo(currentProgram, monitor));
                row.put("commandStatus", command.getStatusMsg());
                analyzeChanges(currentProgram);
                Function function = manager.getFunctionAt(entry);
                if (function == null) { row.put("status", "function-unavailable"); continue; }
                row.put("derivedBody", ranges(function.getBody()));
                row.put("derivedBodyBytes", function.getBody().getNumAddresses());
                row.put("noReturn", function.hasNoReturn());
                List<Map<String,Object>> instructions = new ArrayList<>(); row.put("instructions", instructions);
                InstructionIterator it = currentProgram.getListing().getInstructions(function.getBody(), true);
                while (it.hasNext()) {
                    Instruction instruction = it.next(); Map<String,Object> item = new LinkedHashMap<>();
                    item.put("address", instruction.getAddress().toString()); item.put("bytesHex", hex(instruction.getBytes()));
                    item.put("text", instruction.toString()); item.put("flowType", instruction.getFlowType().toString());
                    item.put("fallThrough", instruction.getFallThrough() == null ? null : instruction.getFallThrough().toString());
                    List<String> flows = new ArrayList<>(); for (Address address : instruction.getFlows()) flows.add(address.toString());
                    item.put("flows", flows); instructions.add(item);
                }
                decompiler.flushCache(); DecompileResults result = decompiler.decompileFunction(function, 120, monitor);
                row.put("decompileCompleted", result.decompileCompleted()); row.put("decompileError", result.getErrorMessage());
                row.put("pseudocode", result.decompileCompleted() ? result.getDecompiledFunction().getC() : null);
                row.put("status", result.decompileCompleted() ? "derived-static-export" : "decompile-unavailable");
                println(entry + ": " + row.get("status") + ", body=" + row.get("derivedBodyBytes"));
            }
        } finally { decompiler.dispose(); }
        Files.writeString(output, new GsonBuilder().setPrettyPrinting().serializeNulls().create().toJson(report) + "\n", StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);
    }
}
