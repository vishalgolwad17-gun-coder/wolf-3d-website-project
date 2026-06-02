import React,{useEffect, useRef} from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { BoxGeometry } from 'three'
import { OrbitControls , useGLTF ,useTexture , useAnimations } from '@react-three/drei'
import { normalMap, rotate, texture } from 'three/tsl'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


const Wolf = () => {

  const model = useGLTF('/models/dog.drc.glb')
  
  useThree(({camera,scene,gl})=>{
    camera.position.set(0,0,0.55)
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const {actions} = useAnimations(model.animations,model.scene)

  useEffect(()=>{
    actions["Take 001"].play()
  },[actions])

const [normalMap,branches_normals,wolf_righteye] = (useTexture([
  "/dog_normals.jpg",
  "/models/branches_normals.jpg",
  "/matcap/mat-2.png"
])).map((texture)=>{
  texture.flipY = false
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
})

const [mat1,mat2,mat3,mat4,mat5,mat6,mat7,mat8,mat9,mat10] = (useTexture([
  "/matcap/mat-1.png","/matcap/mat-2.png","/matcap/mat-3.png",
  "/matcap/mat-4.png","/matcap/mat-5.png","/matcap/mat-6.png",
  "/matcap/mat-7.png","/matcap/mat-8.png","/matcap/mat-9.png",
  "/matcap/mat-10.png"
])).map((texture)=>{
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
})

const material = useRef({
  uMatcap1: {value:mat1},
  uMatcap2: {value:mat6},
  uProgress: {value:0.0}
})


    const dogmaterial = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: mat6
    })

    const Reyematerial = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: wolf_righteye
    })

    const branchmaterial = new THREE.MeshMatcapMaterial({
      normalMap: branches_normals,
      matcap: mat1
    })

    function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    dogmaterial.onBeforeCompile = onBeforeCompile
    branchmaterial.onBeforeCompile = onBeforeCompile


  model.scene.traverse((child)=>{
    if(child.name.includes('DOG')){
      child.material = dogmaterial
    }else{
      child.material = branchmaterial
    }
  })

  model.scene.traverse((child)=>{
   if(child.name.includes('Reye')){
    child.material = Reyematerial
   }else{
    child.material = dogmaterial
   }
  })

   model.scene.traverse((child)=>{
    if(child.name.includes('Leye')){
      child.material = Reyematerial
    }
   })

  gsap.registerPlugin(ScrollTrigger)


  useGSAP(()=>{
    
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger:"#section1",
        endTrigger:"#section3",
        start:"top top",
        end:"bottom bottom",
        
        scrub:1
      }
    })

    tl.to(model.scene.position,{
      z:"-=0.75",
      y:"+=0.15"
    })
    tl.to(model.scene.rotation,{
      y:"+=0.3",
      x:"+=0.1"
    })
    tl.to(model.scene.rotation,{
      y:"-=3.5",
    },"third")
    tl.to(model.scene.position,{
      x:"-=0.45",
      z:"+=0.60",
      y:"-=0.15"
    },"third")



  },[])

  useEffect(()=>{
    
    document.querySelector('.title[data-title="Tomorrowland"]').addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat6

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

    document.querySelector('.title[data-title="Navy Pier"]').addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat4

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

    document.querySelector('.title[data-title="MSI Chicago"]').addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat5

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })
    
     document.querySelector(".title[data-title='This Was Louises Phone']").addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat3

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

      document.querySelector(".title[data-title='KIKK Festival 2018']").addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat9

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

      document.querySelector(".title[data-title='The Kennedy Center']").addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat10

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

      document.querySelector(".title[data-title='Royal Opera Of Wallonia']").addEventListener('mouseenter',()=>{

      material.current.uMatcap1.value = mat7

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

      document.querySelector("#section2").addEventListener('mouseleave',()=>{

      material.current.uMatcap1.value = mat1

      gsap.to(material.current.uProgress,{
        value:0.0,
        duration:0.5,
        onComplete:()=>{
          material.current.uMatcap2.value = material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

  },[])

  return (
    <>
    <primitive object={model.scene} position={[0.20,-0.55,0]} rotation={[0,Math.PI/5.1,0]}/>
    <directionalLight position={[5,5,5]} intensity={10} color={0xffffff}/>
    
   </>
  )
}

export default Wolf