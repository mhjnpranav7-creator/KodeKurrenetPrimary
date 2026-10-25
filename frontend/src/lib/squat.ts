export type Point={x:number;y:number;visibility?:number};
export type Phase='standing'|'descending'|'bottom'|'ascending';
export function angle(a:Point,b:Point,c:Point){const ab={x:a.x-b.x,y:a.y-b.y},cb={x:c.x-b.x,y:c.y-b.y};const dot=ab.x*cb.x+ab.y*cb.y;const mag=Math.hypot(ab.x,ab.y)*Math.hypot(cb.x,cb.y);return mag?Math.round(Math.acos(Math.min(1,Math.max(-1,dot/mag)))*180/Math.PI):0}
export function squatPhase(kneeAngle:number,previous:number):Phase{if(kneeAngle<115)return 'bottom';if(kneeAngle<previous)return 'descending';if(kneeAngle>155)return 'standing';return 'ascending'}
export function visibility(points:Point[]){if(!points.length)return 0;return points.reduce((sum,p)=>sum+(p.visibility??1),0)/points.length}
