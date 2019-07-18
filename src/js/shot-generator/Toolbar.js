const h = require('../utils/h')

const Icon = require('./Icon')

// TODO DRY
const preventDefault = (fn, ...args) => e => {
  e.preventDefault()
  fn(e, ...args)
}

const Toolbar = ({
  createObject,
  selectObject,
  // loadScene,
  // saveScene,
  camera,
  setActiveCamera,
  // resetScene,
  saveToBoard,
  insertAsNewBoard,
  xrServerUrl,

  undoGroupStart,
  undoGroupEnd
}) => {
  const onCreateCameraClick = () => {
    let id = THREE.Math.generateUUID()

    undoGroupStart()
    createObject({
      id,

      type: 'camera',
      fov: 22.25,
      x: 0,
      y: 6,
      z: 2,
      rotation: 0,
      tilt: 0,
      roll: 0
    })
    selectObject(id)
    setActiveCamera(id)
    undoGroupEnd()
  }

  const onCreateObjectClick = () => {
    let id = THREE.Math.generateUUID()
    //let camera = findCamera();
    let newPoz = generatePositionAndRotation(camera)

    undoGroupStart()
    createObject({
      id,
      type: 'object',
      model: 'box',
      width: 1,
      height: 1,
      depth: 1,
      x: newPoz.x,
      y: newPoz.y,
      z: newPoz.z,
      rotation: { x: 0, y: 0, z: 0 }, //Math.random() * Math.PI * 2,

      visible: true
    })
    selectObject(id)
    undoGroupEnd()
  }

  const generatePositionAndRotation = (camera) => {
    let direction = new THREE.Vector3() // create once and reuse it!
    camera.getWorldDirection( direction )
    let newPos = new THREE.Vector3()
    let dist = (Math.random()) * 6 + 4
    newPos.addVectors ( camera.position, direction.multiplyScalar( dist ) )
    let obj = new THREE.Object3D()
    newPos.x += (Math.random() * 4 - 2)
    newPos.z += (Math.random() * 4 - 2)
    obj.position.set(newPos.x, 0, newPos.z)
    obj.lookAt(camera.position)
    obj.rotation.set(0, obj.rotation.y, 0)  //maybe we want rotation relative to camera (facing the camera)
    obj.rotation.y = Math.random() * Math.PI * 2

    return {
      x: obj.position.x,
      y: obj.position.z,
      z: obj.position.y,
      rotation: obj.rotation.y
    }
  }

  const onCreateCharacterClick = () => {
    let newPoz = generatePositionAndRotation(camera)
    let id = THREE.Math.generateUUID()

    undoGroupStart()
    createObject({
      id,
      type: 'character',
      height: 1.8,
      model: 'adult-male',
      x: newPoz.x,
      y: newPoz.y,
      z: newPoz.z,
      rotation: 0,//newPoz.rotation,
      headScale: 1,

      morphTargets: {
        mesomorphic: 0,
        ectomorphic: 0,
        endomorphic: 0
      },

      posePresetId: DEFAULT_POSE_PRESET_ID,
      skeleton: defaultPosePresets[DEFAULT_POSE_PRESET_ID].state.skeleton,

      visible: true
    })
    selectObject(id)
    undoGroupEnd()
  }

  const onCreateLightClick = () => {
    let id = THREE.Math.generateUUID()

    undoGroupStart()
    createObject({
      id,
      type: 'light',
      x: 0,
      y: 0,
      z: 2,
      rotation: 0,
      tilt: 0,
      roll: 0,
      intensity: 0.8,
      visible: true,
      angle: 1.04,
      distance: 5,
      penumbra: 1.0,
      decay: 1,
    })
    selectObject(id)
    undoGroupEnd()
  }

  const onCreateVolumeClick = () => {
    let id = THREE.Math.generateUUID()

    undoGroupStart()
    createObject({
      id,
      type: 'volume',
      x: 0,
      y:2,
      z: 0,
      width: 5,
      height: 5,
      depth:5,
      rotation: 0,
      visible: true,
      opacity: 0.3,
      color: 0x777777,
      numberOfLayers: 4,
      distanceBetweenLayers: 1.5,
      volumeImageAttachmentIds: ['rain2', 'rain1']
    })
    selectObject(id)
    undoGroupEnd()
  }

  // const onCreateStressClick = () => {
  //   undoGroupStart()
  //   for (let i = 0; i < 500; i++) {
  //     onCreateObjectClick()
  //   }
  //   for (let i = 0; i < 20; i++) {
  //     onCreateCharacterClick()
  //   }
  //   undoGroupEnd()
  //   setTimeout(() => {
  //     console.log(Object.values(getSceneObjects($r.store.getState())).length, 'scene objects')
  //   }, 100)
  // }

  // const onLoadClick = () => {
  //   let filepaths = dialog.showOpenDialog(null, {})
  //   if (filepaths) {
  //     let filepath = filepaths[0]
  //     let choice = dialog.showMessageBox(null, {
  //       type: 'question',
  //       buttons: ['Yes', 'No'],
  //       message: 'Your existing scene will be cleared to load the file. Are you sure?',
  //       defaultId: 1 // default to No
  //     })
  //     if (choice === 0) {
  //       try {
  //         let data = JSON.parse(
  //           fs.readFileSync(filepath)
  //         )
  //         loadScene(data)
  //       } catch (err) {
  //         console.error(err)
  //         dialog.showMessageBox(null, {
  //           message: 'Sorry, an error occurred.'
  //         })
  //       }
  //     }
  //   }
  // }

  /*
  const onSaveClick = () => {
    let filepath = dialog.showSaveDialog(null, { defaultPath: 'test.json' })
    if (filepath) {
      // if (fs.existsSync(filepath)) {
      //   let choice = dialog.showMessageBox(null, {
      //     type: 'question',
      //     buttons: ['Yes', 'No'],
      //     message: 'That file already exists. Overwrite?',
      //     defaultId: 1 // default to No
      //   })
      //   if (choice === 1) return
      // }
      saveScene(filepath)
    }
  }
  */

  // const onClearClick = () => {
  //   let choice = dialog.showMessageBox(null, {
  //     type: 'question',
  //     buttons: ['Yes', 'No'],
  //     message: 'Your existing scene will be cleared. Are you sure?',
  //     defaultId: 1 // default to No
  //   })
  //   if (choice === 0) {
  //     resetScene()
  //   }
  // }

  const onSaveToBoardClick = () => {
    saveToBoard()
  }

  const onInsertNewBoardClick = () => {
    insertAsNewBoard()
  }

  const onOpenVR = preventDefault(() =>
    notifications.notify({
      message: `To view, open a VR web browser to:\n<a href="${xrServerUrl}">${xrServerUrl}</a>`,
      timing: 30,
      onClick: () => require('electron').shell.openExternal(xrServerUrl)
    })
  )

  return h(
    ['div#toolbar', { key: 'toolbar' },
      ['div.toolbar__addition.row', [
        ['a[href=#]', { onClick: preventDefault(onCreateCameraClick) }, [[Icon, { src: 'icon-toolbar-camera' }], 'Camera']],
        ['a[href=#]', { onClick: preventDefault(onCreateObjectClick) }, [[Icon, { src: 'icon-toolbar-object' }], 'Object']],
        ['a[href=#]', { onClick: preventDefault(onCreateCharacterClick) }, [[Icon, { src: 'icon-toolbar-character' }], 'Character']],
        ['a[href=#]', { onClick: preventDefault(onCreateLightClick) }, [[Icon, { src: 'icon-toolbar-light' }], 'Light']],
        ['a[href=#]', { onClick: preventDefault(onCreateVolumeClick) }, [[Icon, { src: 'icon-toolbar-volume' }], 'Volume']]
      ]],
      // ['a[href=#]', { onClick: preventDefault(onCreateStressClick) }, '+ STRESS'],

      // ['a[href=#]', { onClick: preventDefault(onClearClick) }, 'Clear'],
      // ['a[href=#]', { onClick: preventDefault(onLoadClick) }, 'Load'],
      // ['a[href=#]', { onClick: preventDefault(onSaveClick) }, 'Save'],

      ['div.toolbar__board-actions.row', [
        xrServerUrl ? ['a[href=#]', { onClick: preventDefault(onOpenVR) }, 'Open in VR'] : [],
        ['a[href=#]', { onClick: preventDefault(onSaveToBoardClick) }, [[Icon, { src: 'icon-toolbar-save-to-board' }], 'Save to Board']],
        ['a[href=#]', { onClick: preventDefault(onInsertNewBoardClick) }, [[Icon, { src: 'icon-toolbar-insert-as-new-board' }], 'Insert As New Board']],
      ]]
    ]
  )
}

module.exports = Toolbar
