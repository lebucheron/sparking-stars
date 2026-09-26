
import {useEffect,useRef,useState} from 'react';
export function DemoRecorder(){
 const [choosing,setChoosing]=useState(false);
 const [recording,setRecording]=useState(false),[remaining,setRemaining]=useState(45),[url,setUrl]=useState(''),[error,setError]=useState(''),[extension,setExtension]=useState('webm');
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),active=useRef(true),objectUrl=useRef('');
 const stop=()=>{if(recorder.current?.state==='recording')recorder.current.stop();if(timer.current)clearInterval(timer.current);stream.current?.getTracks().forEach(t=>t.stop());setRecording(false);};
 useEffect(()=>()=>{active.current=false;if(timer.current)clearInterval(timer.current);if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);},[]);
 async function start(){
  if(choosing||recording)return;setError('');if(!navigator.mediaDevices?.getDisplayMedia||typeof MediaRecorder==='undefined'){setError('Enregistrement indisponible ici. Utilise un navigateur de bureau récent.');return;}
  setChoosing(true);try{
   const media=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:false});if(!active.current){media.getTracks().forEach(t=>t.stop());return;}stream.current=media;
   const mime=['video/mp4','video/webm;codecs=vp9','video/webm'].find(v=>MediaRecorder.isTypeSupported(v));
   const capture=new MediaRecorder(media,mime?{mimeType:mime}:undefined),chunks:BlobPart[]=[];recorder.current=capture;
   capture.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};capture.onstop=()=>{if(timer.current)clearInterval(timer.current);media.getTracks().forEach(t=>t.stop());if(!active.current)return;const type=capture.mimeType||'video/webm';if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);objectUrl.current=URL.createObjectURL(new Blob(chunks,{type}));setUrl(objectUrl.current);setExtension(type.includes('mp4')?'mp4':'webm');setRecording(false);};
   media.getVideoTracks()[0].addEventListener('ended',stop,{once:true});capture.start(1000);setRecording(true);setRemaining(45);const end=Date.now()+45000;
   timer.current=setInterval(()=>{setRemaining(Math.max(0,Math.ceil((end-Date.now())/1000)));if(Date.now()>=end)stop();},250);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());setError(e instanceof DOMException&&e.name==='NotAllowedError'?'Capture annulée.':'Impossible de démarrer la capture.');}finally{if(active.current)setChoosing(false);}
 }
 return <div className="demo-recorder">{recording?<button onClick={stop}>■ Terminer · {remaining}s</button>:<button disabled={choosing} title="Choisis l’onglet du jeu : capture locale, sans son, arrêt après 45 secondes." onClick={()=>void start()}>{choosing?"Choisis l’onglet…":"Filmer la démo · 45 s"}</button>}{url&&<a href={url} download={`sparking-stars-demo.${extension}`}>Télécharger la vidéo</a>}{error&&<span role="status">{error}</span>}</div>;
}
