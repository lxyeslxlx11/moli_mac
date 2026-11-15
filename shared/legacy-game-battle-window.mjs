/** Fixed37c4 GMN window dimensions, opening border and type4 tile requests. */
import {legacyGameTextFontMetrics,measureLegacyGameText} from './legacy-game-text.mjs';

const cellWidth=74,cellHeight=54,base=0x3be34;

export function planLegacyGameGMNNotice(name){
  const lines=[];
  let start=0;
  for(let i=0;i<=name.length;i++){
    if(i===name.length||name[i]===10){
      lines.push(name.slice(start,i));
      start=i+1;
    }
  }
  let longest=lines[0];
  for(const line of lines)if(line.length>longest.length)longest=line;
  const font=0,style=4;
  const heightOfFont=legacyGameTextFontMetrics(font).singleHeight;
  const width=80+measureLegacyGameText(longest,font);
  // 445170 consumes complete double-byte units. Validate each line before it reaches the glyph port.
  for(const line of lines)if(line!==longest)measureLegacyGameText(line,font);
  const height=80+heightOfFont+(lines.length>1?(heightOfFont+1)*lines.length:0);
  const x=(640-width)>>1,y=(480-height)>>1;
  return {x,y,width,height,font,style,lines};
}

export function legacyGameGMNOpeningBorder(draw,viewportWidth,viewportHeight){
  const left=Math.max(0,draw.x),top=Math.max(0,draw.y);
  const right=Math.min(viewportWidth,draw.x+draw.width),bottom=Math.min(viewportHeight,draw.y+draw.height);
  const w=right-left,h=bottom-top;
  if(w<3||h<3)return [];
  const result=[];
  const fill=(x,y,width,height)=>result.push({x,y,blackRectangle:[width,height],priority:212});
  fill(left+1,top,w-2,2);
  fill(left+1,bottom-2,w-2,2);
  fill(left,top+1,2,h-2);
  fill(right-2,top+1,2,h-2);
  if(w>=5){
    for(const x of [left+2,right-3]){
      fill(x,top+2,1,1);
      fill(x,bottom-3,1,1);
    }
  }
  return result;
}

export function legacyGameGMNWindowTiles({x,y,width,height},alternativeRenderer){
  const left=Math.min(cellWidth,width>>1),right=Math.min(cellWidth,width-left);
  const top=Math.min(cellHeight,height>>1),bottom=Math.min(cellHeight,height-top);
  const rightX=x+width-right,bottomY=y+height-bottom;
  const startX=-(cellWidth>>1),startY=-(cellHeight>>1);
  const rightSource=startX+cellWidth-right,bottomSource=startY+cellHeight-bottom;
  const tiles=[];
  const tile=(index,dx,dy,sx,sy,w,h,opacity=255)=>tiles.push({
    resourceId:base+index,x:dx,y:dy,sourceRectangle:[sx,sy,w,h],opacity,
  });

  tile(0,x,y,startX,startY,left,top);
  tile(2,rightX,y,rightSource,startY,right,top);
  tile(6,x,bottomY,startX,bottomSource,left,bottom);
  tile(8,rightX,bottomY,rightSource,bottomSource,right,bottom);
  for(let dy=y+top;dy<bottomY;dy+=cellHeight){
    const h=Math.min(cellHeight,bottomY-dy);
    tile(3,x,dy,startX,startY,left,h);
    tile(5,rightX,dy,rightSource,startY,right,h);
  }
  for(let dx=x+left;dx<rightX;dx+=cellWidth){
    const w=Math.min(cellWidth,rightX-dx);
    tile(1,dx,y,startX,startY,w,top);
    tile(7,dx,bottomY,startX,bottomSource,w,bottom);
  }
  for(let dy=y;dy<y+height;dy+=cellHeight){
    const h=Math.min(cellHeight,y+height-dy);
    for(let dx=x;dx<x+width;dx+=cellWidth){
      tile(4,dx,dy,startX,startY,Math.min(cellWidth,x+width-dx),h,alternativeRenderer?128:255);
    }
  }
  return tiles;
}
