/** Fixed37c4 4032f0/4034f0/4033b0/403410/403530 value and observable RNG contracts.
 * This local port does not establish whole native object-pool/RNG equivalence.
 */
export function battleIntegerBox(value,random){
 const mask=random.next();return {encoded:(value^mask)>>>0,mask,reads:0};
}
export function battleIntegerBoxPeek(box){return (box.encoded^box.mask)|0;}
export function battleIntegerBoxRead(box,random){
 box.reads++;
 if(box.reads>20){const value=battleIntegerBoxPeek(box);box.reads=0;box.mask=random.next();box.encoded=(value^box.mask)>>>0;}
 return battleIntegerBoxPeek(box);
}
// 4033b0 reads the stack argument first,then ECX,and performs signed SETGE.
export function battleIntegerBoxAtLeast(counter,limit,random){
 const maximum=battleIntegerBoxRead(limit,random);return battleIntegerBoxRead(counter,random)>=maximum;
}
// 403410's dummy stack argument is not a replacement value. EAX returns value+1.
export function battleIntegerBoxIncrement(box,random){
 const value=(battleIntegerBoxRead(box,random)+1)|0;box.encoded=(value^box.mask)>>>0;return value;
}
export function battleIntegerBoxSnapshot(box){return Object.freeze({value:battleIntegerBoxPeek(box),encoded:box.encoded,mask:box.mask,reads:box.reads});}
