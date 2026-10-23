// Shared camera bounds for the 1024 × 1024 region maps.
function boundMapView(view,minSize=20){
 const size=Math.max(minSize,Math.min(1024,Number.isFinite(view[2])?view[2]:1024));
 const limit=1024-size;
 return [Math.max(0,Math.min(limit,Number.isFinite(view[0])?view[0]:0)),Math.max(0,Math.min(limit,Number.isFinite(view[1])?view[1]:0)),size,size];
}
