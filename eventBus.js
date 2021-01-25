const EventBus = (()=>{
  const $events = {};
  const $cache = new Set();
  const $on = (name,fn) => {
    if($cache.has(name)){
      $cache.delete(name);
      return fn();
    }
    if(!$events[name]){
      $events[name] = [];
    }
    $events[name].push(fn);
  };
  const $emit = (...args)=>{
    const key = args.shift();
    const fns = $events[key];
    if(!fns?.length){
      $cache.add(key);
      return false;
    } 
    fns.forEach(fn => fn.apply(args));
  };
  const $off = (name,fn)=>{
    const key = $events[name];
    if(!key) return false;
    const fns = $events[name];
    if(!fn) return $events.length = 0;
    for(const _fn of fns.values()){
      if(_fn === fn){
        fns.splice(1,1);
      }
    }
  };
  return ()=>({$on,$emit,$off});
})();

export default EventBus();

export const installEventBus = (client)=>{
  const eventBus = EventBus();
  for(const key in eventBus){
    client[key] = eventBus[key];
  }
};