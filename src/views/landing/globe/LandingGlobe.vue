<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, ref, computed, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { calcPosFromLatLngRad, places, loadFile, parseData } from '@helpers/globe.js'
import earthmap from '@assets/textures/world.jpg'

const globe = ref(null)
const renderer = ref(null)
let controls
let multiply = 1.5
let curves = []
let count = 50

const { width, height } = useWindowSize()

const aspectRatio = computed(() => width.value / height.value)
watch(aspectRatio, updateRenderer)
watch(aspectRatio, updateCamera)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, aspectRatio.value, 0.01, 1000)
const light = new THREE.AmbientLight(0x404040)
const loader = new THREE.TextureLoader()
let group = new THREE.Group()

const geometry = new THREE.SphereGeometry(1 * multiply, 64, 32)
// const material = new THREE.MeshBasicMaterial({
//   map: loader.load(earthmap)
// })
const material = new THREE.MeshStandardMaterial({
  color: 0x0b2636,
  transparent: true,
  opacity: 0.9
})
const sphere = new THREE.Mesh(geometry, material)

camera.position.z = 5

places.forEach((point, index) => {
  let pos = calcPosFromLatLngRad(point.lat, point.lng, multiply)

  if (index < places.length - 1) {
    let pos1 = calcPosFromLatLngRad(places[index + 1].lat, places[index + 1].lng, multiply)
    curves.push({ start: pos, end: pos1, progress: 0 })
  }
})

function getCurve(p1, p2, progress) {
  let v1 = new THREE.Vector3(p1.x, p1.y, p1.z)
  let v2 = new THREE.Vector3(p2.x, p2.y, p2.z)
  let points = []
  let pointCount = Math.abs(Math.floor(count * progress))
  for (let i = 0; i < pointCount; i++) {
    let p = new THREE.Vector3().lerpVectors(v1, v2, i / count)
    p.normalize()
    p.multiplyScalar(1 * multiply + 0.4 * Math.sin((Math.PI * i) / count))
    points.push(p)
  }

  if (points.length > 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0x9213d6 })
    const line = new THREE.Line(geometry, material)
    group.add(line)

    setTimeout(() => {
      // if (progress === 1) group.remove(line)
      // group.remove(line)
      line.geometry.dispose()
      line.material.dispose()
    }, 500)
  }
}

onMounted(() => {
  renderer.value = new THREE.WebGLRenderer({
    canvas: globe.value,
    antialias: true,
    alpha: true
  })
  // renderer.value.setClearColor(0x31464c)
  controls = new OrbitControls(camera, renderer.value.domElement)
  controls.enableDamping = true
  render()
  update()
  animate()
})

group.add(sphere)

scene.add(camera)
scene.add(group)
scene.add(light)

let frameCount = 0
let randomIndex = 0

function animate() {
  renderer.value.render(scene, camera)
  controls.update()
  frameCount++
  if (frameCount >= 200) {
    randomIndex = Math.floor(Math.random() * curves.length)
    frameCount = 0 // Reset the frame counter
  }
  curves.forEach((curve, index) => {
    if (curve.progress < 1 && index === randomIndex) {
      curve.progress += 0.03 // Increase progress to animate the curve
      getCurve(curve.start, curve.end, curve.progress)
    } else if (curve.progress >= 1) {
      // curve.shrinkProgress -= 0.01 // Increase progress to animate the curve
      curve.progress -= 0.01
      getCurve(curve.start, curve.end, curve.progress)
    }
  })

  group.rotation.y += 0.002
  // group.rotation.x += 0.003
  requestAnimationFrame(animate)
}

function render() {
  updateRenderer()
  updateCamera()
}
function updateRenderer() {
  renderer.value.setSize(width.value, height.value)
  renderer.value.setPixelRatio(window.devicePixelRatio)
}

function updateCamera() {
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
}

function update() {
  loadFile(
    'https://threejs.org/manual/examples/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc'
  )
    .then(parseData)
    .then(addBoxes)
}

function addBoxes(file) {
  const { min, max, data } = file
  const range = max - min

  // make one box geometry
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  // make it so it scales away from the positive Z axis
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))

  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new THREE.Object3D()
  group.add(lonHelper)
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new THREE.Object3D()
  lonHelper.add(latHelper)
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new THREE.Object3D()
  positionHelper.position.z = 1 * multiply
  latHelper.add(positionHelper)

  const lonFudge = Math.PI * 0.5
  const latFudge = Math.PI * -0.135
  data.forEach((row, latNdx) => {
    row.forEach((value, lonNdx) => {
      if (value === undefined) {
        return
      }

      const amount = (value - min) / range
      const material = new THREE.MeshBasicMaterial()
      const hue = THREE.MathUtils.lerp(0.7, 0.3, amount)
      const saturation = 1
      const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount)
      material.color.setHSL(hue, saturation, lightness)
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge
      latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge

      // use the world matrix of the position helper to
      // position this mesh.
      positionHelper.updateWorldMatrix(true, false)
      mesh.applyMatrix4(positionHelper.matrixWorld)

      mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount))
    })
  })
}
</script>

<template>
  <div class="w-full h-[50vh]">
    <canvas id="globe" ref="globe"></canvas>
  </div>
</template>

<style scoped>
#globe {
  pointer-events: none;
  position: fixed;
  top: -200px;
  left: 0px;
  z-index: -1;
  background: #0f2027;
  background: -webkit-linear-gradient(to top, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to top, #0f2027, #203a43, #2c5364);
}
</style>
