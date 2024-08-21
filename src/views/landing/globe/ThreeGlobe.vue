<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import earthmap from '@assets/textures/world_alpha_mini.jpg'
import gsap from 'gsap'
import { useElementSize } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { calcPosFromLatLngRad, places } from '@helpers/globe.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import pin from '@assets/images/pin.png'

const globe = ref(null)
const globeContainer = ref(null)
const { width, height } = useElementSize(globeContainer)
const vertex = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  uniform float u_maxExtrusion;

  void main() {

    vec3 newPosition = position;
    if(u_maxExtrusion > 1.0) newPosition.xyz = newPosition.xyz * u_maxExtrusion + sin(u_time);
    else newPosition.xyz = newPosition.xyz * u_maxExtrusion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

  }
`
const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;

  vec3 colorA = vec3(0.196, 0.631, 0.886);
  vec3 colorB = vec3(0.192, 0.384, 0.498);

  void main() {

    vec3  color = vec3(0.0);
    float pct   = abs(sin(u_time));
          color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color, 1.0);

  }
`

let sizes,
  scene,
  camera,
  renderer,
  controls,
  raycaster,
  mouse,
  isIntersecting,
  twinkleTime,
  materials,
  material,
  baseMesh,
  minMouseDownFlag,
  mouseDown,
  grabbing,
  labelRenderer,
  sceneGroup
const aspectRatio = computed(() => width.value / height.value)
const setScene = () => {
  sizes = {
    width: width.value,
    height: height.value
  }

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(35, aspectRatio.value, 0.01, 1000)
  camera.position.set(0, 10, 500)

  renderer = new THREE.WebGLRenderer({
    canvas: globe.value,
    antialias: false,
    alpha: true,
    shadowMapEnabled: false
  })
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(window.devicePixelRatio)

  const pointLight = new THREE.PointLight(0x081b26, 17, 200)
  pointLight.position.set(-50, 0, 60)
  pointLight.castShadow = false
  scene.add(pointLight)
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1.5))

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  isIntersecting = false
  minMouseDownFlag = false
  mouseDown = false
  grabbing = false

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(width.value, height.value)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.pointerEvents = 'none'
  const container = document.getElementById('globeContain')
  container.appendChild(labelRenderer.domElement)

  setControls()
  setBaseSphere()
  setShaderMaterial()
  setMap()
  setPlaces()
  resize()
  // listenTo()
  render()
}

const setControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.update()
  controls.autoRotate = true
  controls.autoRotateSpeed = 2
  controls.enableDamping = true
  controls.enableRotate = true
  controls.enablePan = false
  controls.enableZoom = false
  controls.minPolarAngle = Math.PI / 2 - 1
  controls.maxPolarAngle = Math.PI / 2 + 1
}

const setPlaces = () => {
  const group = new THREE.Group()
  places.forEach((point, index) => {
    let pos = calcPosFromLatLngRad(point.lat, point.lng, 20)

    const place = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    place.position.set(pos.x, pos.y + 10, pos.z)
    place.name = point.name
    group.add(place)

    const p = document.createElement('p')
    p.style.color = 'background'
    p.style.visibility = 'hidden'
    p.textContent = point.name

    const img = document.createElement('img')
    img.src = pin
    img.style.width = '40px'
    img.style.height = '40px'
    img.style.visibility = 'hidden'
    img.style.boxShadow = 'none'
    img.style.outline = 'none'

    const pContainer = document.createElement('div')

    pContainer.appendChild(p)
    pContainer.appendChild(img)
    const cPointLabel = new CSS2DObject(pContainer)
    cPointLabel.position.set(pos.x - 1, pos.y + 12, pos.z)
    if (point.name === 'Qatar') {
      p.style.transform = 'translate(30px, 30px)'
    }
    group.add(cPointLabel)

    const updateVisibility = () => {
      const cameraPosition = camera.position
      const distanceToPlace = cameraPosition.distanceTo(place.position)
      const distanceToBaseMeshCenter = cameraPosition.distanceTo(new THREE.Vector3(0, 10, 0))

      if (distanceToPlace > distanceToBaseMeshCenter) {
        // Place is behind the globe
        place.visible = false
        cPointLabel.visible = false
        p.style.visibility = 'hidden'
        img.style.visibility = 'hidden'
      } else {
        place.visible = true
        cPointLabel.visible = true
        p.style.visibility = 'visible'
        img.style.visibility = 'visible'
      }
    }
    const animate = () => {
      updateVisibility()
      requestAnimationFrame(animate)
    }

    animate()
  })
  scene.add(group)
}

const setBaseSphere = () => {
  const baseSphere = new THREE.SphereGeometry(19.5, 35, 35)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b2636,
    transparent: true,
    opacity: 0.9
  })
  baseMesh = new THREE.Mesh(baseSphere, baseMaterial)
  baseMesh.position.y = 10

  scene.add(baseMesh)
}

const setShaderMaterial = () => {
  twinkleTime = 0.03
  materials = []
  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      u_time: { value: 1.0 },
      u_maxExtrusion: { value: 1.0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment
  })
}

const setMap = () => {
  let activeLatLon = {}
  const dotSphereRadius = 20

  const readImageData = (imageData) => {
    for (let i = 0, lon = -180, lat = 90; i < imageData.length; i += 4, lon++) {
      if (!activeLatLon[lat]) activeLatLon[lat] = []

      const red = imageData[i]
      const green = imageData[i + 1]
      const blue = imageData[i + 2]

      if (red < 80 && green < 80 && blue < 80) activeLatLon[lat].push(lon)

      if (lon === 180) {
        lon = -180
        lat--
      }
    }
  }

  const visibilityForCoordinate = (lon, lat) => {
    let visible = false

    if (!activeLatLon[lat].length) return visible

    const closest = activeLatLon[lat].reduce((prev, curr) => {
      return Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev
    })

    if (Math.abs(lon - closest) < 0.5) visible = true

    return visible
  }

  const createMaterial = (timeValue) => {
    const mat = material.clone()
    mat.uniforms.u_time.value = timeValue * Math.sin(Math.random())
    materials.push(mat)
    return mat
  }

  const setDots = () => {
    const dotDensity = 2.5
    let vector = new THREE.Vector3()
    const dotsGroup = new THREE.Group()

    for (let lat = 90, i = 0; lat > -90; lat--, i++) {
      const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius
      const circumference = radius * Math.PI * 2
      const dotsForLat = circumference * dotDensity

      for (let x = 0; x < dotsForLat; x++) {
        const long = -180 + (x * 360) / dotsForLat

        if (!visibilityForCoordinate(long, lat)) continue

        const pos = calcPosFromLatLngRad(lat, long, 20)
        vector = new THREE.Vector3(pos.x, pos.y, pos.z)
        const dotGeometry = new THREE.CircleGeometry(0.1, 5)
        dotGeometry.lookAt(vector)
        dotGeometry.translate(vector.x, vector.y, vector.z)

        const m = createMaterial(i)
        const mesh = new THREE.Mesh(dotGeometry, m)
        mesh.position.y = 10
        dotsGroup.add(mesh)
      }
    }
    scene.add(dotsGroup)
  }

  const image = new Image()
  image.onload = () => {
    image.needsUpdate = true

    const imageCanvas = document.createElement('canvas')
    imageCanvas.width = image.width
    imageCanvas.height = image.height

    const context = imageCanvas.getContext('2d')
    context.drawImage(image, 0, 0)

    const imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height)
    readImageData(imageData.data)

    setDots()
  }

  image.src = earthmap
}

const resize = () => {
  sizes = {
    width: width.value,
    height: height.value
  }

  if (window.innerWidth > 700) camera.position.z = 100
  else camera.position.z = 140

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  labelRenderer.setSize(sizes.width, sizes.height)
}

const mousemove = (event) => {
  isIntersecting = false

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObject(baseMesh)
  if (intersects[0]) {
    isIntersecting = true
    if (!grabbing) document.body.style.cursor = 'pointer'
  } else {
    if (!grabbing) document.body.style.cursor = 'default'
  }
}

const mousedown = () => {
  if (!isIntersecting) return

  materials.forEach((el) => {
    gsap.to(el.uniforms.u_maxExtrusion, {
      value: 1.07
    })
  })

  mouseDown = true
  minMouseDownFlag = false

  setTimeout(() => {
    minMouseDownFlag = true
    if (!mouseDown) mouseup()
  }, 500)

  document.body.style.cursor = 'grabbing'
  grabbing = true
}

const mouseup = () => {
  mouseDown = false
  if (!minMouseDownFlag) return

  materials.forEach((el) => {
    gsap.to(el.uniforms.u_maxExtrusion, {
      value: 1.0,
      duration: 0.15
    })
  })

  grabbing = false
  if (isIntersecting) document.body.style.cursor = 'pointer'
  else document.body.style.cursor = 'default'
}

const listenTo = () => {
  window.addEventListener('resize', resize.bind(this))
  window.addEventListener('mousemove', mousemove.bind(this))
  window.addEventListener('mousedown', mousedown.bind(this))
  window.addEventListener('mouseup', mouseup.bind(this))
}

const render = () => {
  materials.forEach((el) => {
    el.uniforms.u_time.value += twinkleTime
  })

  labelRenderer.render(scene, camera)
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render.bind(this))
}

onMounted(() => {
  setScene()
})
</script>

<template>
  <div id="globeContain" ref="globeContainer" class="w-full h-[60vh] relative">
    <canvas ref="globe" class="canvas bg"></canvas>
  </div>
</template>

<style scoped>
.canvas {
  width: 100%;
  position: absolute;
  display: block;
  top: 0px;
  left: 0px;
}
.bg {
  background: #0f2027;
  background: -webkit-linear-gradient(to top, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
}
</style>
