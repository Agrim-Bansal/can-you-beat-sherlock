
export default function BackdropColumn({index}) {
    const digits= [1,2,3,4,5,6,7,8,9,0]
    let text = ""
    for(let i=0; i<35; i++){
        text += digits[Math.floor(Math.random() * 10)]
    }

  return (

        <div className={`backdrop_layer`}>
            <div className={`backdrop_text`}>
              {text}
            </div>
          {
            Math.random() > 0.5 ?
            <>
             
             <div className={`backdrop_overlay`} style={{left:index*2 + 'vw',   animation: `move 4s linear ${Math.random()*4}s infinite forwards `}}></div>
            </>
            :
            <>
             <div className={`backdrop_overlay`} style={{left:index*2 + 'vw',   animation: `move 4s linear ${Math.random()*4}s infinite forwards `}}></div>
             <div className={`backdrop_overlay`} style={{left:index*2 + 'vw',   animation: `move 4s linear ${Math.random()*4}s infinite forwards `}}></div>

            </>

          }

        </div>
  )};
