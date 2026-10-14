// @ts-nocheck
/* The wireframe scenes from the construction.live pitch deck, as one factory.
   Ported verbatim from the deck's inline script; the only change is that the
   page runtime (navigation, buttons, orbit) lives in components/home/DeckHome.tsx
   and this module exposes start/setPhase/resize/play/pause/destroy instead.

   Scenes: handshake (opener), team (stack of disciplines), hook (the pain story,
   6 phases), own (the platform on site, 5 phases), train (lorry, crates, loader,
   map; 7 phases), cases (eight deployment stations). Each scene returns
   {scene, cam, update(t), setPhase?(i), progress?()} and reads `canvas` for
   label projection and `reduce` to jump to its final state. */
export function createDeck(THREE, opts) {
  const canvas = opts.canvas;
  const labelsEl = opts.labels;
  const reduce = !!opts.reduceMotion;
  let cur = null, renderer = null, clock = null;

  const C={amber:0xff6b35,cyan:0x3ccfff,red:0xff4141,dim:0x334155,fill:0x0a0e1a,grey:0x8892a4};
  const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
  const lerp=(a,b,t)=>a+(b-a)*t;
  const seg=(t,a,b)=>ease((t-a)/(b-a));

  function mat(color){return new THREE.LineBasicMaterial({color});}
  function edged(geo,color,fill=true){
    const g=new THREE.Group();
    if(fill){g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:C.fill,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})));}
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,20),mat(color)));
    return g;
  }
  function wire(geo,color){return new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color,wireframe:true}));}
  function box(w,h,d,color,x,y,z,fill=true){const b=edged(new THREE.BoxGeometry(w,h,d),color,fill);b.position.set(x,y,z);return b;}
  function light(color,x,y,z,r=0.12){const m=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),new THREE.MeshBasicMaterial({color}));m.position.set(x,y,z);return m;}
  function grid(size,div,color){const g=new THREE.GridHelper(size,div,color,color);g.material.opacity=0.35;g.material.transparent=true;return g;}

  function meshed(geo,color){const g=new THREE.Group();g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:C.fill,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})));g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color,wireframe:true})));return g;}
  // capsule hanging from the origin along -y (r128 has no CapsuleGeometry)
  function capsule(r,len,color,seg=8){
    const g=new THREE.Group();
    const cyl=meshed(new THREE.CylinderGeometry(r,r*0.82,len,seg,2),color);cyl.position.y=-len/2;g.add(cyl);
    const top=meshed(new THREE.SphereGeometry(r,seg,4,0,Math.PI*2,0,Math.PI/2),color);g.add(top);
    const bot=meshed(new THREE.SphereGeometry(r*0.82,seg,4,0,Math.PI*2,Math.PI/2,Math.PI/2),color);bot.position.y=-len;g.add(bot);
    return g;
  }
  function makeFigure(color,kind,scale=1){
    const g=new THREE.Group();
    // head, jaw and neck
    const head=meshed(new THREE.SphereGeometry(0.135,12,9),color);head.scale.set(1,1.18,1.06);head.position.y=1.74;g.add(head);
    const neck=meshed(new THREE.CylinderGeometry(0.05,0.06,0.1,8),color);neck.position.y=1.6;g.add(neck);
    // torso turned on a lathe: shoulders, chest, waist, hips
    const prof=[[0.06,0],[0.2,0.02],[0.25,0.1],[0.23,0.24],[0.19,0.4],[0.215,0.56],[0.27,0.66],[0.26,0.73],[0.15,0.77],[0.05,0.78]].map(p=>new THREE.Vector2(p[0],p[1]));
    const torso=meshed(new THREE.LatheGeometry(prof,12),color);torso.scale.set(1,1,0.62);torso.position.y=0.82;g.add(torso);
    // shoulders and arms with elbows and hands
    const arm=(side)=>{
      const p=new THREE.Group();p.position.set(side*0.29,1.5,0);
      p.add(meshed(new THREE.SphereGeometry(0.085,8,6),color));
      p.add(capsule(0.065,0.3,color));
      const elbow=new THREE.Group();elbow.position.y=-0.32;elbow.add(capsule(0.055,0.28,color));
      const hand=meshed(new THREE.SphereGeometry(0.065,8,6),color);hand.scale.set(0.8,1.2,0.6);hand.position.y=-0.33;elbow.add(hand);
      p.add(elbow);g.add(p);p.userData.elbow=elbow;return p;
    };
    const lArm=arm(-1),rArm=arm(1);
    // legs with knees and feet
    const leg=(side)=>{
      const p=new THREE.Group();p.position.set(side*0.11,0.9,0);
      p.add(capsule(0.095,0.4,color));
      const knee=new THREE.Group();knee.position.y=-0.42;knee.add(capsule(0.07,0.4,color));
      const foot=meshed(new THREE.BoxGeometry(0.12,0.07,0.27,2,1,3),color);foot.position.set(0,-0.45,0.07);knee.add(foot);
      p.add(knee);g.add(p);p.userData.knee=knee;return p;
    };
    const lLeg=leg(-1),rLeg=leg(1);
    if(kind==='expert'){
      const tie=new THREE.Mesh(new THREE.ConeGeometry(0.055,0.4,3),new THREE.MeshBasicMaterial({color:C.amber}));tie.rotation.x=Math.PI;tie.position.set(0,1.3,0.15);g.add(tie);
      const knot=new THREE.Mesh(new THREE.SphereGeometry(0.045,6,4),new THREE.MeshBasicMaterial({color:C.amber}));knot.position.set(0,1.52,0.15);g.add(knot);
      const collar=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.015,6,16),new THREE.MeshBasicMaterial({color:C.amber}));collar.rotation.x=Math.PI/2;collar.position.y=1.56;g.add(collar);
    }else{
      const hat=new THREE.Mesh(new THREE.SphereGeometry(0.175,12,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:C.amber,wireframe:true}));hat.position.y=1.8;g.add(hat);
      const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.23,0.23,0.02,16),new THREE.MeshBasicMaterial({color:C.amber}));brim.position.y=1.8;g.add(brim);
      const vest=new THREE.Mesh(new THREE.TorusGeometry(0.24,0.012,6,16),new THREE.MeshBasicMaterial({color:C.amber}));vest.rotation.x=Math.PI/2;vest.scale.set(1,0.66,1);vest.position.y=1.22;g.add(vest);
    }
    g.scale.setScalar(scale);
    return {g,lArm,rArm,lLeg,rLeg};
  }
  function walk(f,w,amp=0.6){
    const s=Math.sin(w);
    f.lLeg.rotation.x=s*amp;f.rLeg.rotation.x=-s*amp;
    f.lLeg.userData.knee.rotation.x=Math.max(0,s)*amp*1.3;f.rLeg.userData.knee.rotation.x=Math.max(0,-s)*amp*1.3;
    f.lArm.rotation.x=-s*amp*0.6;f.rArm.rotation.x=s*amp*0.6;
    f.lArm.userData.elbow.rotation.x=-0.25-Math.max(0,-s)*amp*0.5;f.rArm.userData.elbow.rotation.x=-0.25-Math.max(0,s)*amp*0.5;
  }

  /* ---------- Scene 1: handshake, then the world builds ---------- */
  function sceneHandshake(){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,60,140);
    const cam=new THREE.PerspectiveCamera(42,1,0.1,300);
    scene.add(grid(140,140,C.dim));
    const ex=makeFigure(C.grey,'expert'),su=makeFigure(C.grey,'super');
    ex.g.rotation.y=Math.PI/2;su.g.rotation.y=-Math.PI/2;su.g.position.x=0.78;ex.g.position.x=-7;
    scene.add(ex.g,su.g);
    // future skyline
    const bld=[];const rnd=mulberry(7);
    for(let i=0;i<44;i++){
      // a ring of blocks around a clear plaza; short in front (camera side, +z), tall at the back so the skyline and bridge read
      let x,z;do{const th=rnd()*Math.PI*2,rr=12+rnd()*18;x=Math.cos(th)*rr;z=Math.sin(th)*rr-6;}while(z>7);
      const back=Math.max(0,(-z-6)/20);const h=(2+rnd()*2.5)+back*(4+rnd()*8),w=1.6+rnd()*2.6,d=1.6+rnd()*2.6;
      const b=box(w,h,d,rnd()>0.75?C.amber:C.grey,x,0,z);b.userData={h,delay:rnd()*3.2};b.scale.y=0.001;b.position.y=0;scene.add(b);bld.push(b);
    }
    // bridge
    const bridge=new THREE.Group();
    bridge.add(box(44,0.35,2.6,C.amber,0,4.2,0));
    for(const tx of[-12,12]){bridge.add(box(0.6,17,0.6,C.amber,tx,8.5,-1));bridge.add(box(0.6,17,0.6,C.amber,tx,8.5,1));
      for(let k=-8;k<=8;k++){const px=tx+k*1.25;const pts=[new THREE.Vector3(tx,17,0),new THREE.Vector3(px,4.4,0)];bridge.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat(C.amber)));}}
    bridge.position.set(0,0,-24);bridge.scale.y=0.001;scene.add(bridge);
    // crane in the distance
    const crane=makeCrane(C.grey);crane.g.position.set(-19,0,-10);crane.g.scale.setScalar(0.001);scene.add(crane.g);

    const target=new THREE.Vector3();
    function update(t){
      const T=reduce?13:t;
      // expert walks in over 0..4.2s
      const wk=seg(T,0,4.2);ex.g.position.x=lerp(-7,-0.78,wk);
      if(T<4.2)walk(ex,T*7);else walk(ex,0,0);
      // super idle
      su.lArm.rotation.x=Math.sin(T*1.5)*0.05;
      // handshake 4.2..5.6: right arms forward
      const hs=seg(T,4.2,5.4);ex.rArm.rotation.x=-1.45*hs;su.rArm.rotation.x=-1.45*hs;ex.rArm.rotation.z=-0.5*hs;su.rArm.rotation.z=-0.5*hs;ex.rArm.userData.elbow.rotation.x=-0.25+0.1*hs;su.rArm.userData.elbow.rotation.x=-0.25+0.1*hs;
      const pump=seg(T,5.4,7.2);ex.rArm.rotation.x+=Math.sin(pump*Math.PI*4)*0.08;su.rArm.rotation.x+=Math.sin(pump*Math.PI*4)*0.08;
      // camera: orbit from behind the expert (a=pi) to the superintendent side
      const a=lerp(Math.PI*1.02,1.9,seg(T,0,5.2));
      let r=lerp(6.5,4.2,seg(T,0,4.2));r=lerp(r,3.2,seg(T,4.8,5.8));
      let h=lerp(2.4,1.8,seg(T,0,4.2));h=lerp(h,1.5,seg(T,4.8,5.8));
      const cx=(ex.g.position.x+su.g.position.x)/2;
      target.set(cx,lerp(1.15,1.1,seg(T,4.8,5.8)),0);
      // zoom out 6.4..8.6
      const zo=seg(T,6.4,8.8);
      r=lerp(r,46,zo);h=lerp(h,24,zo);
      const drift=Math.max(0,T-8.8);
      const a2=lerp(a,Math.PI/2+0.35+Math.sin(drift*0.1)*0.12,zo);
      cam.position.set(target.x+r*Math.cos(a2),h,target.z+r*Math.sin(a2));
      const look=target.clone();look.y=lerp(target.y,5,zo);look.z=lerp(target.z,-10,zo);look.x=lerp(target.x,0,zo);
      cam.lookAt(look);
      // buildings
      for(const b of bld){const s=Math.max(0.001,seg(T,7.2+b.userData.delay,9.2+b.userData.delay));b.scale.y=s;b.position.y=b.userData.h*s/2;}
      bridge.scale.y=Math.max(0.001,seg(T,9.4,11.6));
      const cs=Math.max(0.001,seg(T,10.2,12));crane.g.scale.setScalar(cs);crane.jib.rotation.y=T*0.15;
    }
    return {scene,cam,update,cues:[0.3,0.9,6.2,8.4]};
  }

  function makeCrane(color){
    const g=new THREE.Group();
    g.add(box(1.2,0.3,1.2,color,0,0.15,0));
    g.add(box(0.5,14,0.5,color,0,7,0));
    const jib=new THREE.Group();jib.position.y=14.2;
    jib.add(box(12,0.35,0.35,color,4.5,0,0));jib.add(box(4,0.35,0.35,color,-3.2,0,0));
    jib.add(box(0.9,0.8,0.9,color,-4.6,-0.2,0));
    const trolley=box(0.5,0.3,0.5,color,6,-0.35,0);jib.add(trolley);
    const cable=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,-6,0)]),mat(color));trolley.add(cable);
    const load=box(1.2,0.8,1.2,C.amber,0,-6.4,0);trolley.add(load);
    const lamp=light(C.red,0,0.5,0,0.14);jib.add(lamp);
    g.add(jib);
    return {g,jib,trolley,cable,load,lamp};
  }
  function makeTruck(color){
    const g=new THREE.Group();
    g.add(box(2.6,0.9,1.3,color,-0.3,0.95,0));g.add(box(1.1,1.1,1.3,color,1.6,1.05,0));
    for(const[x,z]of[[-1,-.7],[-1,.7],[1.4,-.7],[1.4,.7]]){const w=edged(new THREE.CylinderGeometry(0.4,0.4,0.3,10),color);w.rotation.x=Math.PI/2;w.position.set(x,0.4,z);g.add(w);}
    const lamp=light(C.red,1.6,1.75,0,0.1);g.add(lamp);
    return {g,lamp};
  }
  function makeExcavator(color){
    const g=new THREE.Group();
    g.add(box(2.4,0.7,1.6,color,0,0.5,0));
    const cab=new THREE.Group();cab.position.y=0.9;cab.add(box(2,1,1.4,color,0,0.5,0));
    const boom=new THREE.Group();boom.position.set(0.9,0.9,0);boom.add(box(3,0.4,0.4,color,1.4,0.8,0));boom.rotation.z=0.5;
    const stick=new THREE.Group();stick.position.set(2.8,1.1,0);stick.add(box(2.2,0.3,0.3,color,0.9,-0.5,0));stick.rotation.z=-0.9;boom.add(stick);
    const bucket=box(0.7,0.6,0.9,color,1.9,-1.1,0);stick.add(bucket);
    cab.add(boom);g.add(cab);
    const lamp=light(C.red,0,2,0,0.1);cab.add(lamp);
    return {g,cab,boom,stick,lamp};
  }


  /* a circuit-board brain: one glowing translucent shell, right-angle traces with node dots, firing points */
  function makeBrain(){
    const g=new THREE.Group();const rnd=mulberry(11);
    const nodes=[];
    const lobe=(sx)=>{
      const sc=new THREE.Vector3(0.95,0.95,1.2),px=0;
      if(sx>0){const shell=wire(new THREE.SphereGeometry(1.15,22,16),C.cyan);shell.material.transparent=true;shell.material.opacity=0.28;shell.scale.copy(sc);shell.position.x=px;g.add(shell);
      const glow=new THREE.Mesh(new THREE.SphereGeometry(1.13,22,16),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.07,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.copy(sc);glow.position.copy(shell.position);g.add(glow);
      const rim=new THREE.Mesh(new THREE.SphereGeometry(1.2,22,16),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.BackSide}));rim.scale.copy(sc);rim.position.copy(shell.position);g.add(rim);}
      // traces drawn on the outer face of the lobe: Manhattan paths with 45° corners, inside an ellipse
      const inside=(y,z)=>(y/0.82)**2+(z/1.05)**2<1;
      for(let k=0;k<11;k++){
        let y=(rnd()-0.5)*1.4,z=(rnd()-0.5)*1.8;if(!inside(y,z))continue;
        const pts=[new THREE.Vector3(0,y,z)];let dir=rnd()>0.5?[1,0]:[0,1];if(rnd()>0.5)dir=dir.map(v=>-v);
        for(let j=0;j<4+Math.floor(rnd()*3);j++){
          const len=0.18+rnd()*0.4;let ny=y+dir[0]*len,nz=z+dir[1]*len;if(!inside(ny,nz))break;y=ny;z=nz;pts.push(new THREE.Vector3(0,y,z));
          const d=0.14;const turn=rnd()>0.5?1:-1;const dd=dir[0]?[dir[0],turn]:[turn,dir[1]];ny=y+dd[0]*d;nz=z+dd[1]*d;if(!inside(ny,nz))break;y=ny;z=nz;pts.push(new THREE.Vector3(0,y,z));
          dir=dir[0]?[0,turn]:[turn,0];
        }
        if(pts.length<3)continue;
        // project each point out to the lobe surface so the trace sits on the shell
        const surf=pts.map(v=>{const yy=v.y/sc.y,zz=v.z/sc.z;const xx=Math.sqrt(Math.max(0.05,1-(yy/1.15)**2-(zz/1.15)**2))*1.15;return new THREE.Vector3(px+sx*xx*sc.x*0.98,v.y,v.z);});
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(surf),new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0.95})));
        for(const e of[surf[0],surf[surf.length-1]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.012,6,14),new THREE.MeshBasicMaterial({color:C.cyan}));ring.position.copy(e);ring.rotation.y=Math.PI/2;g.add(ring);
          const dot=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));dot.position.copy(e);dot.userData.ph=rnd()*6.3;g.add(dot);nodes.push(dot);}
      }
    };
    lobe(-1);lobe(1);
    const core=new THREE.Mesh(new THREE.SphereGeometry(0.28,10,8),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.9}));g.add(core);
    g.userData.tick=(T)=>{for(const n of nodes){const v=Math.max(0,Math.sin(T*2.5+n.userData.ph));n.scale.setScalar(0.6+v*1.6);}core.scale.setScalar(1+Math.sin(T*2.2)*0.18);g.rotation.x=Math.sin(T*0.3)*0.12;};
    g.scale.setScalar(1.9);
    return g;
  }


  /* ---------- Scene 3: the hook (three vignettes, stepped) ---------- */
  function makeFrame(floors,fh,w,d,color,skipCol){
    const g=new THREE.Group();const slabs=[],cols=[];
    const xs=[-w/2,-w/6,w/6,w/2],zs=[-d/2,0,d/2];
    for(let i=0;i<=floors;i++){const sl=box(w+0.4,0.18,d+0.4,color,0,i*fh,0);sl.userData.y=i*fh;g.add(sl);slabs.push(sl);}
    for(let f=0;f<floors;f++)for(const x of xs)for(const z of zs){
      if(skipCol&&f===0&&x===xs[3]&&z===zs[2])continue;
      const c=box(0.3,fh,0.3,color,x,f*fh+fh/2,z,false);c.userData={x,z,y:f*fh+fh/2};g.add(c);cols.push(c);
    }
    return {g,slabs,cols,xs,zs};
  }
  function makeRobot(color,scale=1){
    const g=new THREE.Group();
    const body=edged(new THREE.BoxGeometry(0.7,0.85,0.48),color);body.position.y=1.15;g.add(body);
    const chest=new THREE.Mesh(new THREE.CircleGeometry(0.12,12),new THREE.MeshBasicMaterial({color}));chest.position.set(0,1.25,0.25);g.add(chest);
    const neck=edged(new THREE.CylinderGeometry(0.08,0.08,0.12,8),color);neck.position.y=1.64;g.add(neck);
    const head=edged(new THREE.BoxGeometry(0.5,0.42,0.46),color);head.position.y=1.92;g.add(head);
    for(const sx of[-0.12,0.12]){const eye=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));eye.position.set(sx,1.95,0.24);g.add(eye);}
    const ant=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,2.13,0),new THREE.Vector3(0,2.45,0)]),mat(color));g.add(ant);
    const tip=light(color,0,2.48,0,0.05);g.add(tip);
    const limb=(len,r,x,y)=>{const p=new THREE.Group();p.position.set(x,y,0);const m=edged(new THREE.CylinderGeometry(r,r*0.85,len,6),color);m.position.y=-len/2;p.add(m);const j=edged(new THREE.SphereGeometry(r*1.2,6,5),color);p.add(j);
      const e=new THREE.Group();e.position.y=-len;const m2=edged(new THREE.CylinderGeometry(r*0.85,r*0.7,len*0.9,6),color);m2.position.y=-len*0.45;e.add(m2);const h=edged(new THREE.BoxGeometry(r*2.4,r*2,r*1.6),color);h.position.y=-len*0.95;e.add(h);p.add(e);p.userData.elbow=e;p.userData.knee=e;g.add(p);return p;};
    const lArm=limb(0.36,0.075,-0.46,1.5),rArm=limb(0.36,0.075,0.46,1.5),lLeg=limb(0.4,0.1,-0.2,0.75),rLeg=limb(0.4,0.1,0.2,0.75);
    g.scale.setScalar(scale);
    return {g,lArm,rArm,lLeg,rLeg,tip};
  }
  function sceneHook(el){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,90,220);
    const cam=new THREE.PerspectiveCamera(45,1,0.1,500);
    scene.add(grid(200,200,C.dim));
    const site=new THREE.Group();scene.add(site);
    const fh=2.2,floors=6;const bld=new THREE.Group();site.add(bld);
    const fr=makeFrame(floors,fh,8.6,6.6,C.grey,true);bld.add(fr.g);
    const support=box(0.5,fh,0.5,C.cyan,4.3,fh/2,3.3);bld.add(support);
    const hero=makeFigure(C.amber,'super',1.05);site.add(hero.g);
    const robot=makeRobot(C.cyan,1.1);site.add(robot.g);
    const clones=[];const R=mulberry(9);
    for(let gx=-2;gx<=2;gx++)for(let gz=-2;gz<=2;gz++){if(!gx&&!gz)continue;if(gx>=1&&gz>=0)continue;if(gx===0&&gz===1)continue;const c=bld.clone();c.position.set(gx*24+(R()-0.5)*4,0,gz*20+(R()-0.5)*4);c.scale.setScalar(0.001);c.userData.delay=Math.hypot(gx,gz)*0.6+R()*0.4;site.add(c);clones.push(c);}
    /* trailer */
    const tr=new THREE.Vector3(18,0,10);const trailer=new THREE.Group();trailer.position.copy(tr);site.add(trailer);
    trailer.add(box(7,2.6,4,C.grey,0,1.3,0,false));trailer.add(box(1.4,0.5,0.6,C.grey,-3,0.25,2.4));
    trailer.add(box(5.8,0.08,1,C.grey,0,0.8,-1.2));for(const dx of[-2.8,2.8])for(const dz of[-1.6,-0.8])trailer.add(box(0.08,0.8,0.08,C.grey,dx,0.4,dz,false));
    const stackNames=['Change orders','RFIs','Daily reports','New bids','Drawing changes','Approvals'];
    const paperTex=stackNames.map(n=>{const c=document.createElement('canvas');c.width=256;c.height=186;const x=c.getContext('2d');x.fillStyle='#e6e9ef';x.fillRect(0,0,256,186);x.fillStyle='#0f172a';x.font='700 30px Inter, Arial, sans-serif';x.fillText(n.replace(/s$/,''),16,44);x.strokeStyle='#ff6b35';x.lineWidth=3;x.beginPath();x.moveTo(16,60);x.lineTo(240,60);x.stroke();x.strokeStyle='#8892a4';x.lineWidth=4;for(let y=90;y<170;y+=22){x.beginPath();x.moveTo(16,y);x.lineTo(16+120+((y*7)%90),y);x.stroke();}const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;});
    const papers=[];const P=mulberry(21);const stacks=[[-2.4,-1.2],[-1.45,-1.2],[-0.5,-1.2],[0.5,-1.2],[1.45,-1.2],[2.4,-1.2]];
    for(let i=0;i<42;i++){const pp=new THREE.Group();const sheet=new THREE.Mesh(new THREE.PlaneGeometry(0.62,0.45),new THREE.MeshBasicMaterial({map:paperTex[i%6],side:THREE.DoubleSide}));sheet.rotation.x=-Math.PI/2;pp.add(sheet);
      const sc=[(P()-0.5)*5.6,0.02+P()*0.05,(P()-0.5)*3.2,P()*6.3,(P()-0.5)*0.6];const st=stacks[i%6];const k=Math.floor(i/6);pp.userData={sc,st:[st[0],0.84+k*0.012,st[1],0,0],fly:P()};trailer.add(pp);papers.push(pp);}
    const office=[];for(let i=0;i<4;i++){const f=makeFigure(C.grey,'super',0.62);f.g.userData={ph:i*1.6};trailer.add(f.g);office.push(f);}
    const robot2=makeRobot(C.cyan,0.7);robot2.g.position.set(0,0,0.75);trailer.add(robot2.g);
    const lamp=light(C.red,0,2.5,0,0.09);trailer.add(lamp);
    /* the brain and its threads */
    const brain=makeBrain();brain.position.set(6,21,-4);brain.visible=false;site.add(brain);
    const nodes=[new THREE.Vector3(0,13.6,0),new THREE.Vector3(tr.x,2.9,tr.z),new THREE.Vector3(4.3,2.6,3.3),new THREE.Vector3(-24,13.6,0),new THREE.Vector3(0,13.6,-20),new THREE.Vector3(24,13.6,-20),new THREE.Vector3(-24,13.6,-20)];
    const threads=[],pulses=[],leaks=[];
    nodes.forEach((n,i)=>{const mid=brain.position.clone().lerp(n,0.5);mid.y+=3;const curve=new THREE.CatmullRomCurve3([brain.position.clone(),mid,n.clone()]);const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});site.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),m));threads.push({curve,m});
      const leak=new THREE.Mesh(new THREE.TorusGeometry(0.8,0.07,6,20),new THREE.MeshBasicMaterial({color:C.red}));leak.rotation.x=Math.PI/2;leak.position.copy(n);leak.position.y+=0.3;leak.visible=false;site.add(leak);leaks.push(leak);
      for(let k=0;k<2;k++){const pm=new THREE.Mesh(new THREE.SphereGeometry(0.18,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));pm.visible=false;site.add(pm);pulses.push({curve,mesh:pm,off:k*0.5+i*0.13,dir:k?1:-1});}
    });
    /* phases */
    const order=['clutter','collapse','streamline','support','scale','brain'];const dur=[7.5,10,20,9.5,9,8];
    let phase=0,pt0=0;
    const camPos=new THREE.Vector3(13*Math.cos(0.9),4,13*Math.sin(0.9)),camLook=new THREE.Vector3(1,3,1),want=new THREE.Vector3(),wantLook=new THREE.Vector3();
    function setPhase(i,now){phase=i;pt0=now;
      if(i===0&&now===0){camPos.set(tr.x+6,4,tr.z+8);camLook.set(tr.x,1,tr.z);}
      brain.visible=order[i]==='brain';leaks.forEach(l=>l.visible=order[i]==='brain');
    }
    function holdArms(f,up){f.lArm.rotation.x=up?-2.75:0;f.rArm.rotation.x=up?-2.75:0;f.lArm.userData.elbow.rotation.x=up?0.3:0;f.rArm.userData.elbow.rotation.x=up?0.3:0;}
    function setCollapse(u){fr.slabs.forEach((sl,i)=>{const ui=ease(Math.min(1,Math.max(0,(u-(i/fr.slabs.length)*0.3)/0.7)));sl.position.y=lerp(sl.userData.y,0.25*i,ui);sl.rotation.z=(i%2?1:-1)*0.14*ui;sl.rotation.x=0.05*ui*(i%3-1);});
      fr.cols.forEach((c)=>{const ui=ease(Math.min(1,Math.max(0,(u-0.1)/0.7)));c.scale.y=1-0.9*ui;c.position.y=lerp(c.userData.y,0.3,ui);c.rotation.z=(c.userData.x>0?-1:1)*0.5*ui;c.rotation.x=(c.userData.z>0?1:-1)*0.35*ui;});}
    function update(T){
      const t=reduce?30:T-pt0;const nm=order[phase];const done=(n)=>order.indexOf(n)<phase;
      /* --- building state --- */
      let u=0,sup=0,shake=0;
      if(nm==='clutter'){hero.g.visible=true;hero.g.position.set(4.3,0,3.3);hero.g.rotation.y=0.6;holdArms(hero,true);walk(hero,0,0);hero.lLeg.userData.knee.rotation.x=0;hero.rLeg.userData.knee.rotation.x=0;u=0;}
      else if(nm==='collapse'){const leave=seg(t,3,5.4);hero.g.visible=true;hero.g.position.set(4.3+leave*3,0,3.3+leave*6.5);
        if(leave>0&&leave<1){hero.g.rotation.y=0.43;walk(hero,t*7);}else if(leave>=1){walk(hero,0,0);}else{hero.g.rotation.y=0.6;holdArms(hero,true);hero.lLeg.userData.knee.rotation.x=0;hero.rLeg.userData.knee.rotation.x=0;}
        shake=seg(t,4.4,5.8)*(1-seg(t,7.6,8.4));u=seg(t,5.6,8.6);}
      else if(nm==='streamline'){hero.g.visible=false;u=1;}
      else if(nm==='support'){hero.g.visible=false;u=1-seg(t,2.6,5.6);shake=seg(t,2.4,3)*(1-seg(t,5,5.8));sup=seg(t,5.6,7);}
      else{hero.g.visible=false;u=0;sup=1;}
      setCollapse(u);support.scale.y=Math.max(0.001,sup);support.position.y=fh/2*support.scale.y;
      bld.position.x=Math.sin(t*38)*0.09*shake;bld.position.z=Math.cos(t*31)*0.06*shake;
      /* --- robot at the building --- */
      if(!(nm==='support'||nm==='scale'||nm==='brain')){robot.g.visible=false;}
      else if(nm==='support'){robot.g.visible=true;const rin=seg(t,0,2.4),rout=seg(t,7,8.6);robot.g.position.set(lerp(16,4.3,rin)+rout*3.5,0,lerp(9,3.3,rin)+rout*5);
        if(rin<1){robot.g.rotation.y=-2.2;walk(robot,t*8,0.5);}else if(rout>0&&rout<1){robot.g.rotation.y=0.6;walk(robot,t*8,0.5);}else{walk(robot,0,0);}
        if(rin>=1&&rout<=0)holdArms(robot,t<6.6);}
      else{robot.g.visible=true;robot.g.position.set(7.8,0,8.3);robot.g.rotation.y=0.6;walk(robot,0,0);robot.rArm.rotation.x=nm==='scale'?-1.4*seg(t,0.4,1.2):0;}
      /* --- scale --- */
      for(const c of clones){const sc=nm==='scale'?Math.max(0.001,seg(t,1+c.userData.delay,2.5+c.userData.delay)):done('scale')?1:0.001;c.scale.setScalar(sc);}
      /* --- trailer --- */
      const sort=nm==='streamline'?seg(t,1.5,8.5):done('streamline')?1:0;const calm=nm==='streamline'?seg(t,2.5,8.5):done('streamline')?1:0;
      papers.forEach((pp)=>{const d=pp.userData;const ui=ease(Math.min(1,Math.max(0,(sort-d.fly*0.45)/0.55)));pp.position.set(lerp(d.sc[0],d.st[0],ui),lerp(d.sc[1],d.st[1],ui)+Math.sin(ui*Math.PI)*0.6,lerp(d.sc[2],d.st[2],ui));pp.rotation.y=lerp(d.sc[3],0,ui);pp.rotation.z=lerp(d.sc[4],0,ui);});
      office.forEach((f,i)=>{const d=f.g.userData;const go=nm==='streamline'?seg(t,9+i*0.9,13+i*0.9):done('streamline')?1:0;const w=nm==='streamline'?seg(t,14+i*0.9,19.5+i*0.9):done('streamline')?1:0;
        if(go<=0){const a=T*(1.6-1.4*calm)+d.ph;f.g.position.set(Math.cos(a)*2.4,0,Math.sin(a)*0.65+0.75);f.g.rotation.y=-a;walk(f,T*(10-8*calm)+d.ph,0.55*(1-calm)+0.05);d.from=f.g.position.clone();}
        else if(w<=0){const from=d.from||new THREE.Vector3();const door=new THREE.Vector3(-3,0,2.6),out=new THREE.Vector3(-3-i*1.2,0,3+i*0.5);const p1=seg(go,0,0.45),p2=seg(go,0.45,1);const pos=p1<1?from.clone().lerp(door,p1):door.clone().lerp(out,p2);f.g.position.copy(pos);const dir=p1<1?door.clone().sub(from):out.clone().sub(door);f.g.rotation.y=Math.atan2(dir.x,dir.z);walk(f,T*7+d.ph,0.5);}
        else{const start=new THREE.Vector3(tr.x-3-i*1.2,0,tr.z+3+i*0.5),dest=new THREE.Vector3(4.3+i*1.4,0,5+i*0.8);const pos=start.clone().lerp(dest,ease(w));f.g.position.copy(trailer.worldToLocal(pos));const dir=dest.clone().sub(start);f.g.rotation.y=Math.atan2(dir.x,dir.z);if(w<1)walk(f,T*7+d.ph,0.5);else{walk(f,0,0);f.rArm.rotation.x=-1.2+Math.sin(T*4)*0.4;}}});
      robot2.g.rotation.y=T*1.2*(1-calm*0.8);const busy=sort>0&&sort<1?1:0;robot2.lArm.rotation.x=-1+Math.sin(T*6)*0.6*busy;robot2.rArm.rotation.x=-1-Math.sin(T*6)*0.6*busy;
      lamp.material.color.setHex(calm>0.9?C.cyan:C.red);lamp.scale.setScalar(calm>0.9?1:(Math.sin(T*8)>0?1.4:0.6));
      /* --- brain --- */
      if(nm==='brain'){brain.rotation.y=T*0.35;brain.userData.tick(T);
        threads.forEach((th,i)=>{th.m.opacity=seg(t,1+i*0.8,1.8+i*0.8)*(0.35+Math.max(0,Math.sin(T*3+i))*0.5);});
        leaks.forEach((l,i)=>{const uu=seg(t,1.4+i*0.8,2.2+i*0.8);l.material.color.setHex(uu>0.5?C.cyan:C.red);l.scale.setScalar(uu<0.5?1+Math.sin(T*8)*0.25:1+Math.sin(T*2)*0.06);});
        pulses.forEach((p,i)=>{p.mesh.visible=t>1.4+Math.floor(i/2)*0.8;let uu=(T*0.35*p.dir+p.off)%1;if(uu<0)uu+=1;p.mesh.position.copy(p.curve.getPointAt(uu));});}
      else{pulses.forEach(p=>p.mesh.visible=false);threads.forEach(th=>th.m.opacity=0);}
      /* --- camera --- */
      if(nm==='collapse'||nm==='support'){const a=0.9+Math.sin(T*0.12)*0.12;want.set(Math.cos(a)*13,4.2,Math.sin(a)*13);wantLook.set(1,3,1);}
      else if(nm==='clutter'){const a=0.9+t*0.05;const r=lerp(9,7,seg(t,0,4));want.set(tr.x+Math.cos(a)*r,lerp(3.8,3,seg(t,0,4)),tr.z+Math.sin(a)*r);wantLook.set(tr.x,0.9,tr.z);}
      else if(nm==='scale'){const zo=seg(t,0.5,7.5);const a=1+T*0.03;want.set(Math.cos(a)*lerp(18,120,zo),lerp(8,75,zo),Math.sin(a)*lerp(18,120,zo));wantLook.set(2,lerp(3,0,zo),2);}
      else if(nm==='streamline'){if(t<12){const a=0.9+t*0.05;want.set(tr.x+Math.cos(a)*7,3,tr.z+Math.sin(a)*7);wantLook.set(tr.x,0.9,tr.z);}else{const back=seg(t,12,19);want.set(tr.x+lerp(5,1,back),lerp(3,6.5,back),tr.z+lerp(7,11,back));wantLook.set(lerp(tr.x,8,back),1.2,lerp(tr.z,5,back));}}
      else{const a=0.8+T*0.06;want.set(6+Math.cos(a)*52,30,-4+Math.sin(a)*52);wantLook.set(6,9,-4);}
      camPos.lerp(want,0.03);camLook.lerp(wantLook,0.03);cam.position.copy(camPos);cam.lookAt(camLook);
    }
    setPhase(0,0);
    return {scene,cam,update,cues:[0.3],setPhase:(i)=>setPhase(i,clock.getElapsedTime()-cur.t0),progress:()=>Math.min(1,(clock.getElapsedTime()-cur.t0-pt0)/dur[phase])};
  }

  /* ---------- Scene 5: the stack, shown on the site, then as a pyramid ---------- */
  function sceneOwn(el){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,70,160);
    const cam=new THREE.PerspectiveCamera(45,1,0.1,400);
    scene.add(grid(140,140,C.dim));
    const wrap=el.querySelector('.labels');wrap.innerHTML='';
    const mkLabel=(t)=>{const d=document.createElement('div');d.className='lbl';d.textContent=t;wrap.appendChild(d);return d;};
    const site=new THREE.Group();scene.add(site);
    const fr=makeFrame(6,2.2,8.6,6.6,C.grey,false);fr.g.position.set(2,0,-6);site.add(fr.g);
    const crane=makeCrane(C.grey);crane.g.position.set(-8,0,-2);site.add(crane.g);
    const trailer=box(4,1.6,2,C.grey,12,0.8,7);site.add(trailer);
    const truck=makeTruck(C.grey);truck.g.position.set(-6,0,9);truck.g.rotation.y=2.4;site.add(truck.g);
    for(let i=0;i<5;i++)site.add(box(1.4,0.6+(i%3)*0.3,1.4,C.dim,8+(i%3)*2,0.4,-1+Math.floor(i/3)*2));
    const extras=[];for(let i=0;i<4;i++){const f=makeFigure(C.grey,'super',0.5);f.g.userData={ph:i*1.4,fl:1+i};f.g.position.y=(1+i)*2.2+0.1;fr.g.add(f.g);extras.push(f);}
    /* 1: field worker with the phone */
    const fw=makeFigure(C.amber,'super',1);fw.g.position.set(-1,0,4);fw.g.rotation.y=0.9;site.add(fw.g);
    fw.rArm.rotation.x=-1.3;fw.rArm.userData.elbow.rotation.x=-1.6;fw.lArm.rotation.x=-0.2;
    const phone=box(0.22,0.42,0.04,C.cyan,0,-0.36,0.06);phone.rotation.x=-0.5;fw.rArm.userData.elbow.add(phone);
    const fwRing=new THREE.Mesh(new THREE.TorusGeometry(0.9,0.04,6,24),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.7}));fwRing.rotation.x=Math.PI/2;fwRing.position.set(-1,0.05,4);site.add(fwRing);
    const lField=mkLabel('Field app');
    /* 2: the huddle */
    const huddle=[];const hc=new THREE.Vector3(10,0,3);
    for(let i=0;i<5;i++){const f=makeFigure(i===0?C.amber:C.grey,'super',1);const a=i/5*Math.PI*2;f.g.position.set(hc.x+Math.cos(a)*1.3,0,hc.z+Math.sin(a)*1.3);f.g.rotation.y=-a-Math.PI/2;f.g.userData.ph=i;site.add(f.g);huddle.push(f);}
    const hRing=new THREE.Mesh(new THREE.TorusGeometry(2.2,0.04,6,32),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.7}));hRing.rotation.x=Math.PI/2;hRing.position.set(hc.x,0.05,hc.z);site.add(hRing);
    const lMeet=mkLabel('Meeting platform');
    /* 3: the drawing board */
    const board=new THREE.Group();board.position.set(-6,0,4);board.rotation.y=0.7;site.add(board);
    board.add(box(0.12,2.2,0.12,C.grey,-1.6,1.1,0,false));board.add(box(0.12,2.2,0.12,C.grey,1.6,1.1,0,false));
    const sheet=box(3.4,2,0.06,C.grey,0,2.1,0);board.add(sheet);
    const plan=new THREE.Group();plan.position.set(0,2.1,0.05);board.add(plan);
    const pl=(pts)=>plan.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p[0],p[1],0))),new THREE.LineBasicMaterial({color:C.amber})));
    pl([[-1.4,-0.7],[1.4,-0.7],[1.4,0.7],[-1.4,0.7],[-1.4,-0.7]]);pl([[-0.4,-0.7],[-0.4,0.7]]);pl([[0.5,-0.7],[0.5,0.1]]);pl([[-1.4,0.1],[0.5,0.1]]);pl([[0.5,0.1],[1.4,0.1]]);
    for(let x=-1.1;x<=1.2;x+=0.6)for(let y=-0.4;y<=0.5;y+=0.4)pl([[x-0.05,y],[x+0.05,y]]);
    const bLights=[];for(let i=0;i<6;i++){const l=light(C.cyan,-1.1+i*0.44,2.1+(i%2?0.35:-0.3),0.1,0.05);board.add(l);bLights.push(l);}
    const dThreads=[],dPulses=[];
    site.updateMatrixWorld(true);
    [[-4.3,0.2,-2.7],[2,6.7,-9],[-2.3,4.5,-2.7],[6.3,2.3,-9.3]].forEach((n,i)=>{
      const from=new THREE.Vector3(0,2.1,0).applyMatrix4(board.matrixWorld);const to=new THREE.Vector3(n[0],n[1],n[2]).applyMatrix4(fr.g.matrixWorld);
      const mid=from.clone().lerp(to,0.5);mid.y+=2.5;const curve=new THREE.CatmullRomCurve3([from,mid,to]);
      const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0.6});site.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)),m));dThreads.push({curve,m});
      const pnode=light(C.cyan,to.x,to.y,to.z,0.12);site.add(pnode);dPulses.push({curve,off:i*0.25,mesh:new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),new THREE.MeshBasicMaterial({color:0xffffff}))});site.add(dPulses[i].mesh);
    });
    const lDraw=mkLabel('Drawing intelligence');
    /* 4: the graph over everything */
    const hub=new THREE.Vector3(2,12,1);
    const gNodes=[new THREE.Vector3(-1,2.6,4),new THREE.Vector3(hc.x,2.6,hc.z),new THREE.Vector3(-6,3.2,4),new THREE.Vector3(2,14.5,-6),new THREE.Vector3(-8,14.6,-2),new THREE.Vector3(12,2.2,7),new THREE.Vector3(-6,2.4,9)];
    const gThreads=[],gPulses=[],gDots=[];
    gNodes.forEach((n,i)=>{const mid=hub.clone().lerp(n,0.5);mid.y+=1.5;const curve=new THREE.CatmullRomCurve3([hub.clone(),mid,n.clone()]);const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});site.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)),m));gThreads.push({curve,m});
      const d=light(C.cyan,n.x,n.y,n.z,0.16);d.visible=false;site.add(d);gDots.push(d);
      for(let k=0;k<2;k++){const pm=new THREE.Mesh(new THREE.SphereGeometry(0.14,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));pm.visible=false;site.add(pm);gPulses.push({curve,mesh:pm,off:k*0.5+i*0.13,dir:k?1:-1});}
    });
    // secondary edges between nodes
    const gEdges=[];[[0,1],[1,5],[2,3],[3,4],[0,2],[5,3]].forEach(([a,b])=>{const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});const mid=gNodes[a].clone().lerp(gNodes[b],0.5);mid.y+=3;const curve=new THREE.CatmullRomCurve3([gNodes[a].clone(),mid,gNodes[b].clone()]);site.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),m));gEdges.push(m);});
    const hubMesh=wire(new THREE.IcosahedronGeometry(1.1,1),C.cyan);hubMesh.position.copy(hub);hubMesh.visible=false;site.add(hubMesh);
    const lGraph=mkLabel('Knowledge graph');
    /* 5: the pyramid */
    const pyr=new THREE.Group();pyr.visible=false;scene.add(pyr);
    const layers=['Sovereign intelligence','Knowledge graph','Project register','Drawing intelligence','Meeting platform','Field app'];
    const pSlabs=[],pLabels=[];
    layers.forEach((n,i)=>{const w=9-i*1.25;const sl=box(w,0.5,w*0.62,i===0?C.cyan:C.amber,0,0.35+i*0.85,0);sl.userData={y:0.35+i*0.85,w};sl.position.y=-4;pyr.add(sl);pSlabs.push(sl);pLabels.push(mkLabel(n));});
    const pg=grid(40,40,C.dim);pg.position.y=0;pyr.add(pg);

    const allLabels=[lField,lMeet,lDraw,lGraph,...pLabels];
    let phase=0,pt0=0;const anchor=new THREE.Vector3();
    const camPos=new THREE.Vector3(24,12,26),camLook=new THREE.Vector3(2,3,0);const want=new THREE.Vector3(),wantLook=new THREE.Vector3();
    cam.position.copy(camPos);
    function setPhase(i,now){phase=i;pt0=now;site.visible=i<4;pyr.visible=i===4;allLabels.forEach(l=>l.classList.remove('in'));
      if(i===0&&now===0){camPos.set(24,12,26);camLook.set(2,3,0);}
    }
    function place(lbl,x,y,z,show){anchor.set(x,y,z).project(cam);const W=canvas.clientWidth,H=canvas.clientHeight;lbl.style.left=((anchor.x*0.5+0.5)*W+14)+'px';lbl.style.top=((-anchor.y*0.5+0.5)*H)+'px';lbl.classList.toggle('in',show&&anchor.z<1);}
    function update(T){
      const t=reduce?12:T-pt0;
      if(phase<4){
        // ambient life
        crane.jib.rotation.y=Math.sin(T*0.2)*0.8;
        for(const f of extras){const d=f.g.userData;const a=T*0.4+d.ph;f.g.position.x=Math.cos(a)*2.5;f.g.position.z=Math.sin(a)*1.8;f.g.rotation.y=-a;walk(f,T*7+d.ph);}
        for(const f of huddle){f.g.position.y=Math.sin(T*2+f.g.userData.ph)*0.02;f.lArm.rotation.x=-0.3+Math.sin(T*1.5+f.g.userData.ph)*0.15;}
        fw.g.position.y=0;fw.rArm.rotation.x=-1.3+Math.sin(T*1.2)*0.05;
        fwRing.scale.setScalar(1+Math.sin(T*3)*0.08);hRing.scale.setScalar(1+Math.sin(T*3+1)*0.05);
        fwRing.visible=phase===0;hRing.visible=phase===1;
        const drawOn=phase>=2;bLights.forEach((l,i)=>{l.visible=drawOn;l.scale.setScalar(1+Math.max(0,Math.sin(T*4+i))*1.2);});
        dThreads.forEach((th,i)=>{th.m.opacity=drawOn?seg(t,0.4+i*0.3,1.2+i*0.3)*0.6:0;});
        dPulses.forEach((p,i)=>{p.mesh.visible=drawOn&&t>0.6+i*0.3;let u=(T*0.3+p.off)%1;p.mesh.position.copy(p.curve.getPointAt(u));});
        const graphOn=phase===3;hubMesh.visible=graphOn;if(graphOn){hubMesh.rotation.y=T*0.5;hubMesh.rotation.x=Math.sin(T*0.4)*0.3;}
        gThreads.forEach((th,i)=>{th.m.opacity=graphOn?seg(t,0.3+i*0.25,1+i*0.25)*(0.4+Math.max(0,Math.sin(T*3+i))*0.4):0;});
        gEdges.forEach((m,i)=>{m.opacity=graphOn?seg(t,2+i*0.2,2.8+i*0.2)*0.35:0;});
        gDots.forEach((d,i)=>{d.visible=graphOn&&t>0.3+i*0.25;d.scale.setScalar(1+Math.sin(T*3+i)*0.2);});
        gPulses.forEach((p)=>{p.mesh.visible=graphOn&&t>1.2;let u=(T*0.3*p.dir+p.off)%1;if(u<0)u+=1;p.mesh.position.copy(p.curve.getPointAt(u));});
        // camera targets per phase
        if(phase===0){want.set(4,3.2,10);wantLook.set(-1,1.4,4);}
        else if(phase===1){want.set(14,3.6,9.5);wantLook.set(hc.x,1.4,hc.z);}
        else if(phase===2){want.set(-4,4,11);wantLook.set(-4,2.2,1);}
        else{const a=T*0.06;want.set(Math.cos(a)*30,18,Math.sin(a)*30);wantLook.set(2,6,0);}
        camPos.lerp(want,0.035);camLook.lerp(wantLook,0.035);
        place(lField,-1,2.5,4,phase===0&&t>0.8);place(lMeet,hc.x,2.6,hc.z,phase===1&&t>0.8);place(lDraw,-6,3.4,4,phase===2&&t>0.8);place(lGraph,hub.x,hub.y+1.6,hub.z,phase===3&&t>0.8);
      }else{
        const a=0.75+t*0.08;want.set(Math.cos(a)*17,9,Math.sin(a)*17);wantLook.set(0,2.4,0);camPos.lerp(want,0.05);camLook.lerp(wantLook,0.05);
        pSlabs.forEach((sl,i)=>{const u=seg(t,0.3+i*0.45,1.1+i*0.45);sl.position.y=lerp(-4,sl.userData.y,u);place(pLabels[i],sl.userData.w/2*0.55+0.4,sl.userData.y,sl.userData.w*0.31,u>0.8);});
      }
      cam.position.copy(camPos);cam.lookAt(camLook);
    }
    const dur=[3.5,3.5,4.5,5.5,4.5];
    setPhase(0,0);
    return {scene,cam,update,cues:[0.3],setPhase:(i)=>setPhase(i,clock.getElapsedTime()-cur.t0),progress:()=>Math.min(1,(clock.getElapsedTime()-cur.t0-pt0)/dur[phase])};
  }


  /* ---------- Scene 7: what AI is made of, lorry, crates, loader, map ---------- */
  function makeLorry(color){
    const g=new THREE.Group();
    g.add(box(4.6,0.25,2.2,color,-0.6,1,0));
    for(const sx of[-1,1]){g.add(box(4.6,0.5,0.08,color,-0.6,1.35,sx*1.06));}g.add(box(0.08,0.5,2.2,color,-2.9,1.35,0));
    g.add(box(1.7,1.6,2.1,color,2.4,1.55,0,false));g.add(box(1.7,0.3,2.1,color,2.4,0.85,0));
    const pc=document.createElement('canvas');pc.width=512;pc.height=96;const px=pc.getContext('2d');px.fillStyle='#111827';px.fillRect(0,0,512,96);px.font='600 54px Inter, Arial, sans-serif';px.textBaseline='middle';px.fillStyle='#e2e8f0';px.fillText('construction',22,48);px.fillStyle='#ff6b35';px.fillText('.live',22+px.measureText('construction').width,48);
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(3.6,0.68),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pc)}));plate.position.set(-0.6,1.35,1.1);g.add(plate);const plate2=plate.clone();plate2.position.z=-1.1;plate2.rotation.y=Math.PI;g.add(plate2);
    for(const[x,z]of[[2.3,-1.1],[2.3,1.1],[-0.6,-1.1],[-0.6,1.1],[-2.2,-1.1],[-2.2,1.1]]){const w=edged(new THREE.CylinderGeometry(0.45,0.45,0.35,10),color);w.rotation.x=Math.PI/2;w.position.set(x,0.45,z);g.add(w);}
    const lamp=light(C.amber,3.3,1.4,0,0.08);g.add(lamp);
    return {g};
  }
  function makeLoader(color){
    const g=new THREE.Group();
    g.add(box(2.2,1,1.6,color,0,0.9,0));g.add(box(1.1,0.9,1.3,color,-0.4,1.85,0));
    for(const[x,z]of[[-0.8,-0.9],[-0.8,0.9],[0.8,-0.9],[0.8,0.9]]){const w=edged(new THREE.CylinderGeometry(0.5,0.5,0.4,10),color);w.rotation.x=Math.PI/2;w.position.set(x,0.5,z);g.add(w);}
    const arm=new THREE.Group();arm.position.set(0.6,1.3,0);for(const sz of[-0.7,0.7])arm.add(box(2,0.18,0.18,color,1,0,sz));
    const bucket=box(0.7,0.7,1.8,color,2.1,-0.2,0);arm.add(bucket);g.add(arm);
    return {g,arm,bucket};
  }
  function sceneTrain(el){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,80,200);
    const cam=new THREE.PerspectiveCamera(45,1,0.1,500);
    scene.add(grid(200,200,C.dim));
    const wrap=el.querySelector('.labels');wrap.innerHTML='';
    const mkLabel=(t)=>{const d=document.createElement('div');d.className='lbl';d.textContent=t;wrap.appendChild(d);return d;};
    /* the route: yard on the left, site on the right, two signals on the way */
    const route=new THREE.CatmullRomCurve3([new THREE.Vector3(-14,0,0),new THREE.Vector3(-4,0,1),new THREE.Vector3(4,0,-4),new THREE.Vector3(12,0,-6),new THREE.Vector3(20,0,-1),new THREE.Vector3(27,0,2)]);
    const rp=route.getPoints(80);const off=(d)=>rp.map((p,i)=>{const q=rp[Math.min(i+1,rp.length-1)],r=rp[Math.max(i-1,0)];const dir=q.clone().sub(r).normalize();return new THREE.Vector3(p.x-dir.z*d,0.02,p.z+dir.x*d);});
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(off(1.7)),mat(C.grey)));scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(off(-1.7)),mat(C.grey)));
    const dashes=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rp.filter((_,i)=>i%4<2).map(p=>new THREE.Vector3(p.x,0.02,p.z))),mat(C.dim));scene.add(dashes);
    const sigU=[0.36,0.7];const signals=sigU.map(u=>{const p=route.getPointAt(u);const q=route.getPointAt(u+0.01);const dir=q.clone().sub(p).normalize();const g=new THREE.Group();g.position.set(p.x-dir.z*2.3,0,p.z+dir.x*2.3);g.add(box(0.12,3.2,0.12,C.grey,0,1.6,0,false));g.add(box(0.5,1.1,0.4,C.grey,0,3.4,0));const red=light(C.red,0,3.65,0.22,0.12),grn=light(0x3ddc84,0,3.15,0.22,0.12);g.add(red,grn);scene.add(g);return {red,grn};});
    const dest=makeFrame(4,2.2,7,5,C.grey,false);dest.g.position.set(30,0,-4);scene.add(dest.g);
    const flagPole=box(0.1,4,0.1,C.grey,27,2,-1,false);scene.add(flagPole);const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.8),new THREE.MeshBasicMaterial({color:C.amber,side:THREE.DoubleSide}));flag.position.set(27.75,3.6,-1);scene.add(flag);
    /* the lorry */
    const lorry=makeLorry(C.cyan);scene.add(lorry.g);
    const driver=makeFigure(C.amber,'super',0.62);driver.g.position.set(2.2,0.95,0.5);driver.g.rotation.y=Math.PI/2;driver.lLeg.rotation.x=-1.5;driver.rLeg.rotation.x=-1.5;driver.lLeg.userData.knee.rotation.x=1.5;driver.rLeg.userData.knee.rotation.x=1.5;driver.lArm.rotation.x=-1.1;driver.rArm.rotation.x=-1.1;driver.lArm.userData.elbow.rotation.x=-0.6;driver.rArm.userData.elbow.rotation.x=-0.6;lorry.g.add(driver.g);
    const wheel=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.02,6,16),new THREE.MeshBasicMaterial({color:C.grey}));wheel.position.set(2.65,1.65,0.5);wheel.rotation.y=Math.PI/2;lorry.g.add(wheel);
    const copilot=makeFigure(C.cyan,'expert',0.62);copilot.g.position.set(2.2,0.95,-0.5);copilot.g.rotation.y=Math.PI/2;copilot.lLeg.rotation.x=-1.5;copilot.rLeg.rotation.x=-1.5;copilot.lLeg.userData.knee.rotation.x=1.5;copilot.rLeg.userData.knee.rotation.x=1.5;copilot.rArm.rotation.x=-1.6;copilot.lArm.rotation.x=-0.6;copilot.lArm.userData.elbow.rotation.x=-0.8;lorry.g.add(copilot.g);
    /* the crates: context */
    const names=['Past projects','Bids','Drawings','Emails','Specs','Schedules','Change orders','Photos'];
    const tex=names.map(n=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#111827';x.fillRect(0,0,256,256);x.strokeStyle='#ff6b35';x.lineWidth=6;x.strokeRect(8,8,240,240);x.fillStyle='#e2e8f0';x.font='700 34px Inter, Arial, sans-serif';x.textAlign='center';const w=n.split(' ');w.forEach((t,i)=>x.fillText(t,128,118+i*40-(w.length-1)*20));const t=new THREE.CanvasTexture(c);return t;});
    const pileAt=new THREE.Vector3(-19,0,-6);const crates=[];
    names.forEach((n,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.2,1.2),new THREE.MeshBasicMaterial({map:tex[i]}));const e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),mat(C.amber));m.add(e);
      const col=i%4,row=Math.floor(i/4);const pile=new THREE.Vector3(pileAt.x+col*1.5-2.2,0.6+row*1.25,pileAt.z+(row?0.2:0));const bed=new THREE.Vector3(-2.3+(i%4)*1.3,1.75+Math.floor(i/4)*1.2,0);
      m.userData={pile,bed,rot:(i*0.7)%1.2-0.6};m.position.copy(pile);m.rotation.y=m.userData.rot;scene.add(m);crates.push(m);});
    /* the tools */
    const loader=makeLoader(C.cyan);loader.g.position.set(-15,0,-4);loader.g.rotation.y=Math.PI;scene.add(loader.g);
    const exc=makeExcavator(C.cyan);exc.g.position.set(-22,0,3);exc.g.rotation.y=-0.6;scene.add(exc.g);
    /* the map: a floating board showing the route */
    const map=new THREE.Group();map.position.set(6,6,-14);map.rotation.x=-0.35;scene.add(map);
    const mb=box(10,6.5,0.08,C.grey,0,0,0);map.add(mb);
    const toMap=(p)=>new THREE.Vector3((p.x-6)*0.2,-(p.z+2)*0.5,0.06);
    map.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getPoints(60).map(toMap)),new THREE.LineBasicMaterial({color:C.amber})));
    sigU.forEach(u=>{const d=light(C.red,0,0,0,0.12);d.position.copy(toMap(route.getPointAt(u)));map.add(d);});
    const mstart=light(C.cyan,0,0,0,0.16);mstart.position.copy(toMap(route.getPointAt(0)));map.add(mstart);
    const mend=wire(new THREE.OctahedronGeometry(0.3,0),C.amber);mend.position.copy(toMap(route.getPointAt(1)));map.add(mend);
    const mdot=light(0xffffff,0,0,0,0.14);map.add(mdot);
    map.visible=false;
    const lLLM=mkLabel('LLM'),lCtx=mkLabel('Context'),lTools=mkLabel('Tools'),lFlow=mkLabel('Workflow');
    /* phases */
    let phase=0,pt0=0;const anchor=new THREE.Vector3();
    const camPos=new THREE.Vector3(-8,5,12),camLook=new THREE.Vector3(-12,1,0),want=new THREE.Vector3(),wantLook=new THREE.Vector3();
    function setPhase(i,now){phase=i;pt0=now;map.visible=i>=3;}
    const cab=new THREE.Vector3();
    function place(lbl,x,y,z,show){anchor.set(x,y,z).project(cam);const W=canvas.clientWidth,H=canvas.clientHeight;lbl.style.left=((anchor.x*0.5+0.5)*W+14)+'px';lbl.style.top=((-anchor.y*0.5+0.5)*H)+'px';lbl.classList.toggle('in',show&&anchor.z<1);}
    // the drive: move, wait at each signal, move on
    function driveU(t){if(phase===3)return lerp(0,0.36,seg(t,0.8,4.5));if(phase===4)return lerp(0.36,0.7,seg(t,0.6,4.4));if(phase===5)return lerp(0.7,1,seg(t,0.6,3.8));return 1;}
    function update(T){
      const t=reduce?16:T-pt0;
      // crates: on the pile, being loaded, or on the bed
      crates.forEach((m,i)=>{const d=m.userData;let u=phase<2?0:phase===2?ease(Math.min(1,Math.max(0,(t-0.8-i*0.75)/0.9))):1;
        if(phase>=3){m.position.copy(d.bed).add(lorry.g.position);m.rotation.y=0;}else{const bx=d.bed.x+lorry.g.position.x,bz=d.bed.z+lorry.g.position.z;m.position.set(lerp(d.pile.x,bx,u),lerp(d.pile.y,d.bed.y,u)+Math.sin(u*Math.PI)*2.2,lerp(d.pile.z,bz,u));m.rotation.y=lerp(d.rot,0,u);}
      });
      // loader shuttles between the pile and the lorry while loading
      if(phase===2){const cyc=(t*1.1)%2;const sw=cyc<1?ease(cyc):1-ease(cyc-1);loader.g.position.x=lerp(-17,-11,sw);loader.arm.rotation.z=-0.2+Math.sin(cyc*Math.PI)*0.5;}else{loader.g.position.x=-15;loader.arm.rotation.z=-0.1;}
      exc.cab.rotation.y=Math.sin(T*0.6)*0.5;exc.boom.rotation.z=0.5+Math.sin(T*1.1)*0.2;
      // the lorry drives on the workflow step
      let u=0;if(phase>=3){u=driveU(t);}
      const lp=route.getPointAt(Math.min(0.999,u)),lq=route.getPointAt(Math.min(1,u+0.005));lorry.g.position.set(lp.x,0,lp.z);
      if(u>0)lorry.g.rotation.y=Math.atan2(-(lq.z-lp.z),lq.x-lp.x);else lorry.g.rotation.y=0;
      // crates ride with the lorry
      if(phase>=3){crates.forEach(m=>{const local=m.userData.bed.clone().applyAxisAngle(new THREE.Vector3(0,1,0),lorry.g.rotation.y);m.position.copy(lorry.g.position).add(local);m.rotation.y=lorry.g.rotation.y;});}
      // signals: red until the lorry has waited, then green
      signals.forEach((sg,i)=>{const green=phase>=4+i;sg.red.visible=!green;sg.grn.visible=green;sg.red.scale.setScalar(Math.sin(T*6)>0?1.3:0.8);});
      copilot.rArm.rotation.x=phase>=3?-1.6+Math.sin(T*3)*0.15:-0.6;copilot.rArm.userData.elbow.rotation.x=phase>=3?0:-0.8;
      if(map.visible){mdot.position.copy(toMap(route.getPointAt(Math.min(0.999,u))));}
      // camera per phase
      if(phase===0){want.set(-6,3.5,9);wantLook.set(-12,1.2,0);}
      else if(phase===1){want.set(-14,4,4);wantLook.set(pileAt.x+0.5,1.4,pileAt.z);}
      else if(phase===2){want.set(-9,7,14);wantLook.set(-15,1.2,-2);}
      else if(phase>=3&&phase<=5){want.set(lp.x-6,8,lp.z+15);wantLook.set(lp.x+4,2,lp.z-2);}
      else{const a=T*0.05;want.set(6+Math.cos(a)*34,20,Math.sin(a)*34+8);wantLook.set(6,2,-3);}
      camPos.lerp(want,0.04);camLook.lerp(wantLook,0.04);cam.position.copy(camPos);cam.lookAt(camLook);
      // labels
      place(lLLM,lorry.g.position.x,3.2,lorry.g.position.z,(phase===0||phase===6)&&t>0.6);
      place(lCtx,pileAt.x,3.4,pileAt.z,(phase===1||phase===6)&&t>0.6);
      place(lTools,-15,3.6,-4,(phase===2||phase===6)&&t>0.6);
      place(lFlow,6,9.8,-14,phase>=3&&t>0.6);
    }
    const dur=[2.5,2.5,8.5,5,5,4.5,3.5];
    setPhase(0,0);
    return {scene,cam,update,cues:[0.3],setPhase:(i)=>setPhase(i,clock.getElapsedTime()-cur.t0),progress:()=>Math.min(1,(clock.getElapsedTime()-cur.t0-pt0)/dur[phase])};
  }


  /* ---------- Scene 6: deployed so far, eight stations ---------- */
  function textPlane(text,w,h,opts={}){
    const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');
    x.fillStyle=opts.bg||'#e6e9ef';x.fillRect(0,0,c.width,c.height);x.strokeStyle=opts.border||'#ff6b35';x.lineWidth=8;x.strokeRect(6,6,c.width-12,c.height-12);
    x.fillStyle=opts.fg||'#0f172a';x.font=(opts.weight||700)+' '+(opts.size||56)+'px Inter, Arial, sans-serif';x.textAlign='center';x.textBaseline='middle';
    const lines=String(text).split('\n');lines.forEach((l,i)=>x.fillText(l,c.width/2,c.height/2+(i-(lines.length-1)/2)*(opts.size||56)*1.15));
    if(opts.rule){x.strokeStyle='#8892a4';x.lineWidth=5;for(let y=c.height*0.62;y<c.height-30;y+=26){x.beginPath();x.moveTo(40,y);x.lineTo(c.width-40-((y*13)%120),y);x.stroke();}}
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide,transparent:true}));return m;
  }
  function ring(color,r=0.6){const m=new THREE.Mesh(new THREE.TorusGeometry(r,0.04,6,24),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.8}));return m;}
  function sceneCases(el){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,60,160);
    const cam=new THREE.PerspectiveCamera(42,1,0.1,400);
    scene.add(grid(160,160,C.dim));
    const N=8,RAD=22;const st=[];
    const at=(i)=>{const a=i/N*Math.PI*2;return {a,x:Math.cos(a)*RAD,z:Math.sin(a)*RAD};};
    const mk=(i)=>{const g=new THREE.Group();const p=at(i);g.position.set(p.x,0,p.z);g.rotation.y=-p.a+Math.PI/2;scene.add(g);st.push(g);return g;};
    const up=(m,u)=>{m.scale.setScalar(Math.max(0.001,u));m.visible=u>0.001;};
    const desk=(g,x,z)=>{g.add(box(2.6,0.08,1.1,C.grey,x,0.8,z));for(const dx of[-1.2,1.2])for(const dz of[-0.45,0.45])g.add(box(0.08,0.8,0.08,C.grey,x+dx,0.4,z+dz,false));};
    const centre=box(9,0.18,7,C.grey,0,0.09,0);scene.add(centre);const hub=makeFrame(5,2.2,8,6,C.grey,false);scene.add(hub.g);
    /* 1 voice */
    const s1=mk(0);const w1=makeFigure(C.amber,'super',1);w1.g.position.set(-3,0,1);w1.g.rotation.y=1.2;w1.rArm.rotation.x=-1.3;w1.rArm.userData.elbow.rotation.x=-1.6;s1.add(w1.g);
    const ph1=box(0.22,0.42,0.04,C.cyan,0,-0.36,0.06);ph1.rotation.x=-0.5;w1.rArm.userData.elbow.add(ph1);
    const rings1=[0,1,2].map(k=>{const r=ring(C.cyan,0.3);r.position.set(-3,1.7,1);s1.add(r);return r;});
    desk(s1,2.2,-0.5);const rep1=textPlane('Daily report',1.1,0.8,{rule:true});rep1.rotation.x=-Math.PI/2;rep1.position.set(2.2,0.86,-0.5);s1.add(rep1);
    const sched=new THREE.Group();sched.position.set(2.2,2,-2.2);s1.add(sched);sched.add(box(2.2,1.3,0.06,C.grey,0,0,0));
    const bars=[0,1,2,3,4].map(k=>{const b=box(0.7+((k*7)%3)*0.35,0.12,0.08,k===2?C.cyan:C.grey,-0.8+k*0.25+((k*7)%3)*0.18,0.45-k*0.22,0.05);sched.add(b);return b;});
    const tick1=textPlane('✓',0.4,0.4,{bg:'#0a0e1a',fg:'#3ccfff',border:'#3ccfff',size:180});tick1.position.set(3.1,2.2,-2.1);s1.add(tick1);
    // airport: runway with edge lights and a control tower behind the worker
    const rw=new THREE.Group();rw.position.set(0,0,-6);rw.rotation.y=0.25;s1.add(rw);
    rw.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-14,0.02,-1.4),new THREE.Vector3(14,0.02,-1.4)]),mat(C.grey)));rw.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-14,0.02,1.4),new THREE.Vector3(14,0.02,1.4)]),mat(C.grey)));
    for(let x=-13;x<=13;x+=2)rw.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,0.02,0),new THREE.Vector3(x+1,0.02,0)]),mat(C.dim)));
    const rwl=[];for(let x=-13;x<=13;x+=2.6){for(const z of[-1.6,1.6]){const l=light(C.amber,x,0.08,z,0.06);rw.add(l);rwl.push(l);}}
    const tower=new THREE.Group();tower.position.set(-7,0,-3.5);s1.add(tower);tower.add(box(0.7,5,0.7,C.grey,0,2.5,0));tower.add(box(2.2,1.2,2.2,C.grey,0,5.6,0,false));tower.add(box(2.6,0.15,2.6,C.grey,0,5,0));const tl=light(C.red,0,6.5,0,0.1);tower.add(tl);rwl.push(tl);
    const th1=new THREE.CatmullRomCurve3([new THREE.Vector3(-3,1.7,1),new THREE.Vector3(-0.4,3.2,0.2),new THREE.Vector3(2.2,1,-0.5)]);const th1m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});s1.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(th1.getPoints(30)),th1m));const pulse1=light(0xffffff,0,0,0,0.12);s1.add(pulse1);
    /* 2 change orders */
    const s2=mk(1);desk(s2,-1.5,0);const rep2=textPlane('Daily report',1.1,0.8,{rule:true});rep2.rotation.x=-Math.PI/2;rep2.position.set(-1.5,0.86,0);s2.add(rep2);
    const co=textPlane('Change order',1.1,0.8,{border:'#ff4141',rule:true});co.rotation.x=-Math.PI/2;co.position.set(-1.5,0.9,0);s2.add(co);const coRing=ring(C.red,0.7);coRing.rotation.x=Math.PI/2;coRing.position.set(-1.5,0.95,0);s2.add(coRing);
    const pm=makeFigure(C.amber,'expert',1);pm.g.position.set(2.6,0,0.6);pm.g.rotation.y=-1.4;pm.rArm.rotation.x=-1.1;pm.rArm.userData.elbow.rotation.x=-0.6;s2.add(pm.g);
    const dollar=textPlane('$',0.6,0.6,{bg:'#0a0e1a',fg:'#ff6b35',border:'#ff6b35',size:200});dollar.position.set(2.6,2.6,0.6);s2.add(dollar);
    /* 3 meetings */
    const s3=mk(2);const hud3=[];for(let k=0;k<4;k++){const f=makeFigure(k?C.grey:C.amber,'super',1);const a=k/4*Math.PI*2;f.g.position.set(-1.8+Math.cos(a)*1.2,0,Math.sin(a)*1.2);f.g.rotation.y=-a-Math.PI/2;s3.add(f.g);hud3.push(f);}
    const rings3=[0,1,2].map(k=>{const r=ring(C.cyan,0.6);r.rotation.x=Math.PI/2;r.position.set(-1.8,0.1,0);s3.add(r);return r;});
    const mb=new THREE.Group();mb.position.set(2.4,2,-0.5);mb.rotation.y=-0.4;s3.add(mb);mb.add(box(2.8,2,0.06,C.grey,0,0,0));const mt=textPlane('Minutes · Actions',2.4,0.42,{bg:'#111827',fg:'#e2e8f0',border:'#111827',size:60});mt.position.set(0,0.7,0.05);mb.add(mt);
    const mlines=[0,1,2,3,4].map(k=>{const b=box(1.8-(k%2)*0.5,0.1,0.06,k<3?C.cyan:C.amber,-1.1+0.9-(k%2)*0.25,0.25-k*0.3,0.05);mb.add(b);return b;});
    const clk=new THREE.Group();clk.position.set(2.4,2,2);s3.add(clk);clk.add(ring(C.grey,0.7));const hand=box(0.06,0.6,0.04,C.amber,0,0.3,0,false);clk.add(hand);const pct=textPlane('10%',0.9,0.5,{bg:'#0a0e1a',fg:'#3ccfff',border:'#0a0e1a',size:120});pct.position.set(0,-1.1,0);clk.add(pct);
    /* 4 knowledge */
    const s4=mk(3);const kf=[];for(let k=0;k<5;k++){const f=makeFrame(2+(k%3),1.4,2.4,2,C.grey,false);const a=Math.PI*(0.15+0.7*k/4);f.g.position.set(Math.cos(a)*5.5,0,-Math.sin(a)*3.5-1);f.g.scale.setScalar(0.55);s4.add(f.g);kf.push(f);}
    const kh=wire(new THREE.IcosahedronGeometry(0.8,1),C.cyan);kh.position.set(0,2.6,1.2);s4.add(kh);
    const kth=kf.map(f=>{const from=f.g.position.clone();from.y=1.2;const mid=from.clone().lerp(kh.position,0.5);mid.y+=1;const curve=new THREE.CatmullRomCurve3([from,mid,kh.position.clone()]);const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});s4.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),m));const pl=light(0xffffff,0,0,0,0.1);s4.add(pl);return {curve,m,pl};});
    const ans=textPlane('Answer',1.2,0.8,{border:'#3ccfff',rule:true});ans.position.set(0,4.3,1.2);s4.add(ans);
    /* 5 proposal */
    const s5=mk(4);const team=[];for(let k=0;k<8;k++){const f=makeFigure(C.grey,'super',0.85);f.g.position.set(-3.5+k,0,-1.5);s5.add(f.g);team.push(f);}
    const picked=[1,4,6];desk(s5,0,1.4);const prop=[0,1,2].map(k=>{const pg=textPlane(k?'':'Proposal',1.1,0.8,{rule:true});pg.rotation.x=-Math.PI/2;pg.position.set(0,0.86+k*0.03,1.4);s5.add(pg);return pg;});
    const crates5=[0,1,2].map(k=>{const b=box(0.8,0.8,0.8,C.amber,-2.6+k*0.9,0.4,2.4);s5.add(b);return b;});
    /* 6 takeoff */
    const s6=mk(5);const b6=new THREE.Group();b6.position.set(-1,0,0);s6.add(b6);b6.add(box(0.12,2.2,0.12,C.grey,-1.6,1.1,0,false));b6.add(box(0.12,2.2,0.12,C.grey,1.6,1.1,0,false));b6.add(box(3.4,2.2,0.06,C.grey,0,2.2,0));
    const pl6=new THREE.Group();pl6.position.set(0,2.2,0.05);b6.add(pl6);const ln6=(pts)=>pl6.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p[0],p[1],0))),new THREE.LineBasicMaterial({color:C.amber})));
    ln6([[-1.4,-0.8],[1.4,-0.8],[1.4,0.8],[-1.4,0.8],[-1.4,-0.8]]);for(let x=-0.9;x<=1;x+=0.6)ln6([[x,-0.8],[x,0.8]]);for(let y=-0.4;y<=0.5;y+=0.4)ln6([[-1.4,y],[1.4,y]]);
    const marks=[];for(let x=-0.9;x<=1;x+=0.6)for(let y=-0.4;y<=0.5;y+=0.4){const d=light(C.cyan,x,y,0.03,0.07);pl6.add(d);marks.push(d);}
    const forms=marks.map((_,k)=>{const b=box(0.5,0.5,0.5,C.grey,2.2+(k%4)*0.55,0.25+Math.floor(k/4)*0.55,0);s6.add(b);return b;});
    const cnt=textPlane('12 marks',1.4,0.5,{bg:'#0a0e1a',fg:'#3ccfff',border:'#0a0e1a',size:90});cnt.position.set(-1,3.7,0);s6.add(cnt);
    /* 7 scope change */
    const s7=mk(6);const mkBoard=(x,rev,diff)=>{const b=new THREE.Group();b.position.set(x,0,0);s7.add(b);b.add(box(0.12,2.2,0.12,C.grey,-1.5,1.1,0,false));b.add(box(0.12,2.2,0.12,C.grey,1.5,1.1,0,false));b.add(box(3.2,2.2,0.06,C.grey,0,2.2,0));
      const t=textPlane(rev,1.2,0.4,{bg:'#111827',fg:'#e2e8f0',border:'#111827',size:70});t.position.set(0,3.5,0);b.add(t);const pl=new THREE.Group();pl.position.set(0,2.2,0.05);b.add(pl);
      const ln=(pts,col)=>pl.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p[0],p[1],0))),new THREE.LineBasicMaterial({color:col||C.amber})));
      ln([[-1.3,-0.8],[1.3,-0.8],[1.3,0.8],[-1.3,0.8],[-1.3,-0.8]]);ln([[-0.4,-0.8],[-0.4,0.8]]);ln([[-1.3,0.1],[-0.4,0.1]]);
      if(diff){ln([[0.5,-0.8],[0.5,0.3]],C.red);ln([[0.5,0.3],[1.3,0.3]],C.red);ln([[-0.9,-0.3],[-0.4,-0.3]],C.red);}else{ln([[0.5,-0.8],[0.5,0.8]]);ln([[-1.3,-0.3],[-0.4,-0.3]]);}
      return b;};
    mkBoard(-2.2,'Rev A',false);const bB=mkBoard(2.2,'Rev B',true);
    const diffs=[[0.5,0.3],[0.9,0.3],[-0.65,-0.3]].map(p=>{const r=ring(C.red,0.22);r.position.set(p[0],p[1],0.08);bB.add(r);r.position.y+=2.2;return r;});
    const hosp=makeFrame(4,2,6,4,C.grey,false);hosp.g.position.set(0,0,-5);s7.add(hosp.g);const cross=textPlane('+',0.9,0.9,{bg:'#0a0e1a',fg:'#ff4141',border:'#ff4141',size:260});cross.position.set(0,9.6,-5);s7.add(cross);
    const mgr=makeFigure(C.amber,'expert',1);mgr.g.position.set(0,0,1.6);mgr.g.rotation.y=Math.PI;s7.add(mgr.g);
    /* 8 report */
    const s8=mk(7);desk(s8,0,0);const cons=makeFigure(C.amber,'expert',1);cons.g.position.set(0,0,-1.2);cons.g.rotation.y=0;cons.lArm.rotation.x=-1;cons.rArm.rotation.x=-1;cons.lArm.userData.elbow.rotation.x=-0.7;cons.rArm.userData.elbow.rotation.x=-0.7;s8.add(cons.g);
    const pages=[0,1,2,3,4].map(k=>{const pg=textPlane(k?'':'Technical report',1.1,0.8,{rule:true,size:44});pg.rotation.x=-Math.PI/2;pg.position.set(0,0.86+k*0.02,0);s8.add(pg);return pg;});
    const barBg=box(3.2,0.3,0.1,C.grey,0,2.6,-2);s8.add(barBg);const bar=new THREE.Mesh(new THREE.BoxGeometry(1,0.22,0.12),new THREE.MeshBasicMaterial({color:C.amber}));bar.position.set(0,2.6,-2);s8.add(bar);
    const t70=textPlane('70% less time',1.8,0.5,{bg:'#0a0e1a',fg:'#3ccfff',border:'#0a0e1a',size:80});t70.position.set(0,3.3,-2);s8.add(t70);

    let phase=0,pt0=0;const camPos=new THREE.Vector3(),camLook=new THREE.Vector3(),want=new THREE.Vector3(),wantLook=new THREE.Vector3();
    function target(i){const p=at(i);const o=1.5;const tx=-Math.sin(p.a)*3,tz=Math.cos(p.a)*3;want.set(p.x*o+tx,6.5,p.z*o+tz);wantLook.set(p.x*0.97,1.3,p.z*0.97);}
    target(0);camPos.copy(want);camLook.copy(wantLook);
    function setPhase(i,now){phase=i;pt0=now;}
    const dur=[7,6,7,6.5,6.5,7,6,6.5];
    function update(T){
      const t=reduce?20:T-pt0;const tp=(i)=>phase===i?t:phase>i?20:0;
      /* 1 */{const t1=tp(0);rwl.forEach((l,k)=>l.scale.setScalar(Math.sin(T*4+k*0.7)>0?1.3:0.7));rings1.forEach((r,k)=>{const u=((t1*0.8+k/3)%1);r.scale.setScalar(0.4+u*2.2);r.material.opacity=phase===0?(1-u)*0.8:0;});th1m.opacity=seg(t1,1,1.8)*0.7;pulse1.visible=t1>1.2&&t1<2.6;pulse1.position.copy(th1.getPointAt(Math.min(0.999,seg(t1,1.2,2.6))));up(rep1,seg(t1,2.4,3));up(sched,seg(t1,3.2,3.9));up(tick1,seg(t1,4.4,4.9));bars[2].children[1].material.color.setHex(t1>4.4?C.cyan:C.grey);}
      /* 2 */{const t2=tp(1);up(rep2,1);const rise=seg(t2,0.8,1.8),fly=seg(t2,2.6,3.8);co.position.set(lerp(-1.5,2.0,fly),0.9+rise*0.8+fly*0.6+Math.sin(fly*Math.PI)*0.8,lerp(0,0.4,fly));co.rotation.x=-Math.PI/2+rise*1.2;coRing.position.copy(co.position);coRing.visible=rise>0;coRing.material.color.setHex(fly>0.9?C.cyan:C.red);coRing.scale.setScalar(1+Math.sin(T*8)*0.15*(fly<0.9?1:0));up(dollar,seg(t2,4,4.6));dollar.rotation.y=T*0.8;}
      /* 3 */{const t3=tp(2);hud3.forEach((f,k)=>{f.lArm.rotation.x=-0.3+Math.sin(T*1.5+k)*0.2;});rings3.forEach((r,k)=>{const u=((t3*0.6+k/3)%1);r.scale.setScalar(0.6+u*3);r.material.opacity=phase===2?(1-u)*0.6:0;});up(mb,seg(t3,1,1.6));mlines.forEach((b,k)=>{const u=seg(t3,1.8+k*0.5,2.4+k*0.5);b.scale.x=Math.max(0.001,u);});up(clk,seg(t3,4.4,5));hand.rotation.z=-t3*3;up(pct,seg(t3,5.4,5.9));}
      /* 4 */{const t4=tp(3);kh.rotation.y=T*0.6;kth.forEach((th,k)=>{th.m.opacity=seg(t4,0.6+k*0.4,1.3+k*0.4)*0.7;th.pl.visible=t4>0.8+k*0.4&&t4<5;th.pl.position.copy(th.curve.getPointAt(Math.min(0.999,(T*0.5+k*0.2)%1)));});up(ans,seg(t4,3.4,4));ans.position.y=4.2+Math.sin(T*2)*0.1;}
      /* 5 */{const t5=tp(4);team.forEach((f,k)=>{const pk=picked.indexOf(k);const u=pk<0?0:seg(t5,0.8+pk*0.7,1.4+pk*0.7);f.g.scale.setScalar(0.85+u*0.2);f.g.position.y=u*0.05;f.g.traverse(o=>{if(o.material&&o.material.wireframe)o.material.color.setHex(u>0.5?C.amber:C.grey);});});crates5.forEach((b,k)=>up(b,seg(t5,3+k*0.4,3.5+k*0.4)));prop.forEach((pg,k)=>up(pg,seg(t5,4.4+k*0.35,4.9+k*0.35)));}
      /* 6 */{const t6=tp(5);marks.forEach((d,k)=>{const u=seg(t6,0.8+k*0.25,1.1+k*0.25);d.scale.setScalar(Math.max(0.001,u*(1+Math.sin(T*4+k)*0.2)));});forms.forEach((b,k)=>up(b,seg(t6,1.2+k*0.25,1.6+k*0.25)));up(cnt,seg(t6,4.2,4.7));}
      /* 7 */{const t7=tp(6);diffs.forEach((r,k)=>{const u=seg(t7,1+k*0.8,1.5+k*0.8);r.scale.setScalar(Math.max(0.001,u*(1+Math.sin(T*6+k)*0.2)));r.material.color.setHex(t7>4.2?C.cyan:C.red);});mgr.rArm.rotation.x=t7>1?-1.3:0;mgr.g.rotation.y=Math.PI+Math.sin(T*0.8)*0.4;}
      /* 8 */{const t8=tp(7);pages.forEach((pg,k)=>up(pg,seg(t8,0.6+k*0.35,1+k*0.35)));const sh=seg(t8,2.8,4.6);bar.scale.x=Math.max(0.05,lerp(3.1,0.93,sh));bar.position.x=-(3.1-bar.scale.x)/2;up(t70,seg(t8,4.8,5.3));cons.rArm.rotation.x=-1+Math.sin(T*8)*0.1*(t8<2.8?1:0);}
      target(phase);camPos.lerp(want,0.035);camLook.lerp(wantLook,0.035);cam.position.copy(camPos);cam.lookAt(camLook);
    }
    setPhase(0,0);
    return {scene,cam,update,cues:[0.3],setPhase:(i)=>setPhase(i,clock.getElapsedTime()-cur.t0),progress:()=>Math.min(1,(clock.getElapsedTime()-cur.t0-pt0)/dur[phase])};
  }

  /* ---------- Scene 3/4: the site ---------- */
  function buildSite(sync){
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(C.fill,30,90);
    const cam=new THREE.PerspectiveCamera(45,1,0.1,300);
    scene.add(grid(60,60,C.dim));
    const lamps=[];
    // high-rise frame
    const hr=new THREE.Group();hr.position.set(4,0,-6);
    const floors=7,fh=2.2;
    for(let i=0;i<=floors;i++){const slab=box(9,0.18,7,C.grey,0,i*fh,0,true);hr.add(slab);}
    for(const x of[-4.3,-1.4,1.4,4.3])for(const z of[-3.3,0,3.3]){hr.add(box(0.3,floors*fh,0.3,C.grey,x,floors*fh/2,z,false));}
    const core=box(2,floors*fh+1.5,2,C.grey,0,(floors*fh+1.5)/2,0);hr.add(core);
    const hrLamp=light(C.red,0,floors*fh+1.8,0,0.16);hr.add(hrLamp);lamps.push(hrLamp);
    const workers=[];
    for(let i=0;i<(sync?3:10);i++){const f=makeFigure(C.grey,'super',0.42);const fl=1+(i%floors);f.g.position.y=fl*fh+0.1;f.g.userData={fl,ph:i*1.3,r:2+(i%3),sp:0.4+(i%4)*0.12};hr.add(f.g);workers.push(f);}
    scene.add(hr);
    // crane
    const crane=makeCrane(C.grey);crane.g.position.set(-6,0,-3);scene.add(crane.g);lamps.push(crane.lamp);
    // second crane far
    const crane2=makeCrane(C.grey);crane2.g.position.set(16,0,-14);crane2.g.scale.setScalar(0.8);scene.add(crane2.g);lamps.push(crane2.lamp);
    // loading area
    const exc=makeExcavator(C.grey);exc.g.position.set(-10,0,8);exc.g.rotation.y=0.6;scene.add(exc.g);lamps.push(exc.lamp);
    const dump=makeTruck(C.grey);dump.g.position.set(-7,0,10);dump.g.rotation.y=Math.PI;scene.add(dump.g);lamps.push(dump.lamp);
    const pile=wire(new THREE.ConeGeometry(2,1.6,7),C.grey);pile.position.set(-12.5,0.8,10.5);scene.add(pile);
    // office trailer
    scene.add(box(4,1.6,2,C.grey,12,0.8,8));const tLamp=light(C.red,12,1.9,8,0.12);scene.add(tLamp);lamps.push(tLamp);
    // gate/fence line
    for(let i=-14;i<=14;i+=2){scene.add(box(0.12,1.6,0.12,C.dim,i,0.8,14,false));}
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-14,1.5,14),new THREE.Vector3(14,1.5,14)]),mat(C.dim)));
    // moving trucks on a loop
    const trucks=[];
    const path=new THREE.CatmullRomCurve3([new THREE.Vector3(-16,0,12),new THREE.Vector3(10,0,12.5),new THREE.Vector3(18,0,2),new THREE.Vector3(14,0,-10),new THREE.Vector3(-14,0,-12),new THREE.Vector3(-18,0,2)],true);
    for(let i=0;i<3;i++){const tr=makeTruck(C.grey);tr.g.userData={off:i/3};scene.add(tr.g);trucks.push(tr);lamps.push(tr.lamp);}
    // materials stacks
    for(let i=0;i<6;i++){scene.add(box(1.6,0.5+((i*7)%3)*0.3,1.6,C.dim,8+(i%3)*2.2,0.4,4+Math.floor(i/3)*2.2));}

    // sync threads
    const threads=[],pulses=[],leaks=[];let hub=null;
    if(sync){
      hub=makeBrain();hub.position.set(2,13,2);scene.add(hub);
      const nodes=[new THREE.Vector3(-6,14.5,-3),new THREE.Vector3(4,floors*fh+1.5,-6),new THREE.Vector3(-10,2.5,8),new THREE.Vector3(12,2,8),new THREE.Vector3(16,12,-14),new THREE.Vector3(-7,1.8,10),new THREE.Vector3(0,1.6,14)];
      for(const n of nodes){
        const mid=hub.position.clone().lerp(n,0.5);mid.y+=2.5;
        const curve=new THREE.CatmullRomCurve3([hub.position.clone(),mid,n.clone()]);
        const leak=new THREE.Mesh(new THREE.TorusGeometry(0.7,0.06,6,20),new THREE.MeshBasicMaterial({color:C.red}));leak.rotation.x=Math.PI/2;leak.position.copy(n);leak.position.y+=0.3;leak.userData={at:1.5+leaks.length*1.1};scene.add(leak);leaks.push(leak);
        const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
        const m=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0.55});
        scene.add(new THREE.Line(geo,m));threads.push({curve,m});
        for(let k=0;k<2;k++){const p=new THREE.Mesh(new THREE.SphereGeometry(0.18,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));p.userData={curve,off:k*0.5+Math.random()*0.3,dir:k?1:-1};scene.add(p);pulses.push(p);}
      }
      for(const l of lamps)l.material.color.setHex(C.cyan);
      crane.load.children[1].material.color.setHex(C.cyan);
    }

    // camera keyframes for the chaos tour
    const keys=[
      {p:[26,14,26],l:[0,4,0],t:0},
      {p:[-2,16,10],l:[-6,12,-3],t:4},      // crane
      {p:[-3,6,16],l:[-9,1.5,9],t:7.5},     // loading
      {p:[10,9,3],l:[4,8,-6],t:11},         // floor with people
      {p:[26,14,26],l:[0,4,0],t:15}
    ];
    const cp=new THREE.Vector3(),cl=new THREE.Vector3();
    function tour(T){
      const L=15;let t=T%L;
      if(reduce){t=0;}
      let k=0;while(k<keys.length-2&&t>=keys[k+1].t)k++;
      const a=keys[k],b=keys[k+1];const u=seg(t,a.t,b.t);
      cp.set(lerp(a.p[0],b.p[0],u),lerp(a.p[1],b.p[1],u),lerp(a.p[2],b.p[2],u));
      cl.set(lerp(a.l[0],b.l[0],u),lerp(a.l[1],b.l[1],u),lerp(a.l[2],b.l[2],u));
      if(k===0||k===keys.length-2){const ang=T*0.05;cp.x=Math.cos(ang)*cp.x-Math.sin(ang)*cp.z;cp.z=Math.sin(ang)*cp.x+Math.cos(ang)*cp.z;}
      cam.position.copy(cp);cam.lookAt(cl);
    }
    function update(T){
      // crane: slew and lift
      crane.jib.rotation.y=Math.sin(T*0.25)*0.9;crane.trolley.position.x=6+Math.sin(T*0.4)*2.5;
      const lift=-3-Math.abs(Math.sin(T*0.5))*5;crane.load.position.y=lift-0.4;crane.cable.geometry.setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,lift,0)]);
      crane2.jib.rotation.y=T*0.2;
      // excavator digs
      exc.cab.rotation.y=Math.sin(T*0.6)*0.9;exc.boom.rotation.z=0.5+Math.sin(T*1.2)*0.3;exc.stick.rotation.z=-0.9+Math.cos(T*1.2)*0.4;
      // trucks
      for(const tr of trucks){const u=(T*0.03+tr.g.userData.off)%1;const p=path.getPointAt(u),q=path.getPointAt((u+0.01)%1);tr.g.position.copy(p);tr.g.lookAt(q);tr.g.rotation.y+=Math.PI/2;}
      // workers walk on their floor
      for(const w of workers){const d=w.g.userData;const ang=T*d.sp+d.ph;w.g.position.x=Math.cos(ang)*d.r;w.g.position.z=Math.sin(ang)*d.r*0.7;w.g.rotation.y=-ang;walk(w,T*8+d.ph);}
      // lamps
      for(let i=0;i<lamps.length;i++){const l=lamps[i];const s=sync?1+Math.sin(T*2+i)*0.15:(Math.sin(T*7+i*1.7)>0?1.4:0.5);l.scale.setScalar(s);}
      if(sync){
        hub.rotation.y=T*0.35;hub.userData.tick(T);
        for(const l of leaks){const u=seg(T,l.userData.at,l.userData.at+0.8);l.material.color.setHex(u>0.5?C.cyan:C.red);const b=u<0.5?1+Math.sin(T*8)*0.25:1+Math.sin(T*2)*0.06;l.scale.setScalar(b);}
        threads.forEach((th,i)=>{th.m.opacity=seg(T,1.2+i*1.1,2+i*1.1)*(0.35+Math.max(0,Math.sin(T*3+th.curve.points[2].x))*0.5);});
        for(const p of pulses){let u=(T*0.35*p.userData.dir+p.userData.off)%1;if(u<0)u+=1;p.position.copy(p.userData.curve.getPointAt(u));p.visible=T>1.2+pulses.indexOf(p)/2*1.1;}
        const ang=T*0.08;cam.position.set(Math.cos(ang)*30,15+Math.sin(T*0.2)*1.5,Math.sin(ang)*30);cam.lookAt(1,5,0);
      }else tour(T);
    }
    return {scene,cam,update,cues:[0.3,0.9,1.6]};
  }

  /* ---------- Scene 2: the team stack ---------- */
  function sceneTeam(el){
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(36,1,0.1,100);
    const names=['Construction operations','Engineering','Computer vision','Cyber security','Claims','AI systems'];
    const slabs=[];const wrap=el.querySelector('.labels');wrap.innerHTML='';
    names.forEach((n,i)=>{
      const s=box(4.2,0.32,2.6,i===0?C.cyan:C.amber,0,i*0.62,0);s.userData={y:i*0.62};s.position.y=-3;scene.add(s);slabs.push(s);
      const d=document.createElement('div');d.className='lbl';d.textContent=n;wrap.appendChild(d);
    });
    const ground=grid(30,30,C.dim);ground.position.y=-0.3;scene.add(ground);
    const anchor=new THREE.Vector3();
    function update(T){
      const t=reduce?20:T;
      const ang=Math.PI*0.28+Math.sin(t*0.15)*0.1;
      cam.position.set(Math.cos(ang)*9.5,5.2,Math.sin(ang)*9.5);cam.lookAt(0,1.6,0);
      const W=canvas.clientWidth,H=canvas.clientHeight;
      slabs.forEach((s,i)=>{
        const u=seg(t,0.4+i*0.55,1.3+i*0.55);s.position.y=lerp(-3,s.userData.y,u);
        anchor.set(2.2,s.userData.y,1.3).project(cam);
        const d=wrap.children[i];d.style.left=((anchor.x*0.5+0.5)*W+18)+'px';d.style.top=((-anchor.y*0.5+0.5)*H)+'px';d.classList.toggle('in',u>0.8);
      });
    }
    return {scene,cam,update,cues:[0.2,0.6,1.2,2.2]};
  }

  function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}





  /* ---------- runtime for the website ---------- */
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(C.fill, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio || 1.5));
  clock = new THREE.Clock();
  const fakeEl = { querySelector: () => labelsEl };
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    if (cur) { cur.cam.aspect = w / h; cur.cam.updateProjectionMatrix(); }
  }
  function dispose() {
    if (!cur) return;
    cur.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
    });
    cur = null;
    labelsEl.innerHTML = "";
  }
  let running = false, raf = 0;
  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!cur) return;
    const t = clock.getElapsedTime() - cur.t0;
    cur.update(t);
    renderer.render(cur.scene, cur.cam);
  }
  function start(kind) {
    if (cur && cur.kind === kind) return;
    dispose();
    cur = kind === "handshake" ? sceneHandshake()
      : kind === "team" ? sceneTeam(fakeEl)
      : kind === "hook" ? sceneHook(fakeEl)
      : kind === "own" ? sceneOwn(fakeEl)
      : kind === "train" ? sceneTrain(fakeEl)
      : kind === "cases" ? sceneCases(fakeEl)
      : null;
    if (cur) { cur.t0 = clock.getElapsedTime(); cur.kind = kind; resize(); }
  }
  function setPhase(i) { if (cur && cur.setPhase) cur.setPhase(i); }
  function restart() { if (cur) { const k = cur.kind; dispose(); start(k); } }
  function play() { if (running) return; running = true; frame(); }
  function pause() { running = false; cancelAnimationFrame(raf); }
  function destroy() { pause(); dispose(); renderer.dispose(); }
  return { start, setPhase, restart, resize, play, pause, destroy, current: () => (cur ? cur.kind : null) };
}
