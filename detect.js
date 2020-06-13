(function() {
	const Resourcelinks = [
		'https://privacycheck.sec.lrz.de',
		'https://ghacksuserjs.github.io/TorZillaPrint/TorZillaPrint.html',
		'https://browserleaks.com',
		'https://webbrowsertools.com',
		'https://www.nothingprivate.ml',
		'https://fingerprintjs.com/demo',
		'https://bestiejs.github.io/platform.js',
		'https://webglreport.com',
		'https://old.darkwavetech.com/fingerprint/fingerprint_code.html',
		'https://github.com/Valve/fingerprintjs2',
		'https://github.com/JackSpirou/ClientJS',
		'https://plaperdr.github.io',
		'https://docs.google.com/spreadsheets/d/1ZB1zINfGFcrcFzNg4eytRnBQN3nBoKHua2jhV_X6W80'
	].join('\n')
	const options = {
		traceFirstRead: false,
		injectFrames: false,
		alertType: 'abort'
	}
	// helpers
	const getCurrentScript = () => {
		const jsURL = /(\/.+\.js)/gi
		const error = new Error()
		let path
		try {
			path = error.stack.match(jsURL)[0]
			return path
		}
		catch (err) {
			return '🤔'
		}
	}
	const domLoaded = (fn) => document.readyState != 'loading'?
    	fn(): document.addEventListener('DOMContentLoaded', fn)
	const isFn = (x) => typeof x === 'function' ? x() : x
	const timer = (logStart) => {
		console.log(logStart)
		const start = Date.now()
		return (logEnd) => {
			const end = Date.now() - start
			console.log(`${logEnd}: ${end/1000} seconds`)
		}
	}
	const itemInList = (list, item) => list.indexOf(item) > -1
	const listRand = (list) => list[Math.floor(Math.random() * list.length)]
	const evenRand = (min, max) =>
		(Math.floor(Math.random() * ((max/2) - min + 1)) + min)*2
	const rand = (min, max) =>
		(Math.floor(Math.random() * (max - min + 1)) + min)
	const randomRGBA = () => {
	    const clr = () => Math.round(Math.random()*255)
	    return `rgba(${clr()},${clr()},${clr()},${Math.random().toFixed(1)})`
	}
	const randomFont = () => {
		const fontFamily = [
			'Arial','Arial Black','Arial Narrow','Courier','Courier New','Georgia','Helvetica',
			'Impact','Lucida Console','monospace','Tahoma','Times','Times New Roman','Verdana'
		]
		const fontSize = Math.floor((Math.random() * 100) + 12)
		const rand = Math.floor(Math.random()*fontFamily.length)
		return `${fontSize}px '${fontFamily[rand]}'`
	}
	const hashify = str => {
		let i, len, hash = 0x811c9dc5
		for (i = 0, len = str.length; i < len; i++) {
			hash = Math.imul(31, hash) + str.charCodeAt(i)|0
		}
		return ("0000000" + (hash >>> 0).toString(16)).substr(-8)
	}
	// randomize
	const randomizationTime = timer('🔥Computing randomization...')
	const randomized = { browser: {}, device: {} }
	// todo: https://www.whatismybrowser.com/guides/the-latest-version/
	const randomizify = (env, prop, val, canLie = true) => {
		if (canLie) { randomized[env][prop] = [prop, isFn(val)] }
		return val
	}
	const doNotTrack = () => {
		const val = listRand(['0','1'])
		return () => val
	}
	function canLieTouch() {
	  const userAgent = navigator.userAgent
	  const os = (
	    /windows phone/ig.test(userAgent)? 'Windows Phone':
	    /win(dows|16|32|64|95|98|nt)|wow64/ig.test(userAgent)? 'Windows':
	    /android/ig.test(userAgent)? 'Android': 
	    /linux/ig.test(userAgent)? 'Linux': 
	    /ios/ig.test(userAgent)? 'iOS': 
	    /mac/ig.test(userAgent)? 'Mac':
	    /cros/ig.test(userAgent)? 'CrOS':
	    'Other' 
	  )
	  const touchOS = (/^(Windows(| Phone)|CrOS|Android|iOS)$/ig.test(os))
	  //let touchAPI = ('ontouchstart' in window)
	  //try { document.createEvent('TouchEvent') }
	  //catch (err) { touchAPI = false }
	  return () => touchOS //&& touchAPI
	}
	const canLieTouchComputed = canLieTouch()
	const maxTouchPoints = () => { const val = rand(1, 10); return () => val }
	const hardwareConcurrency = () => { const val = rand(1, 16); return () => val }
	const deviceMemory = () => { const val = evenRand(2, 32); return () => val }
	// https://gs.statcounter.com/screen-resolution-stats
	const screenFingerprint = () => {
		const val = listRand([{w:1920,h:1080},{w:1440,h:900},{w:1280,h:800},{w:1600,h:900}])
		val.asrw = val.w-rand(1, 20)
		val.asrh = val.h-rand(1, 20)
		val.cDepth = listRand([24, 32, 48])
		val.pDepth = listRand([24, 32, 48])
		return () => val
	}
	const screenFingerprintComputed = screenFingerprint()
	const canvasDataURL = () => {
		const canvas = document.createElement('canvas')
		const txt = '🚀 Private'
		const context = canvas.getContext('2d')
		context.textBaseline = 'top'
		context.textBaseline = 'alphabetic'
		context.font = randomFont()
		context.fillStyle = randomRGBA()
		context.fillRect(125, 1, 62, 20)
		context.fillText(txt, 2, 15)
		const dataURL = canvas.toDataURL()
		randomized.browser.toDataURL = ['HTMLCanvasElement.toDataURL', hashify(dataURL)]
		return () => dataURL
	}
	const audioBufferChannelData = () => {
		const context = new AudioContext()
		const channels = 2
		const frameCount = (context.sampleRate*2)/2000 // reduce initial size for randomization
		const audioBuffer = context.createBuffer(2, frameCount, context.sampleRate)
		let pcmData = audioBuffer.getChannelData(0)
		for (let i = 0; i < frameCount; i++) { pcmData[i] = Math.random() * 2 - 1 } // randomize
		const cache = {}
		cache.arr = Array.from(pcmData) // convert to Array
		const randomChannelData = cache.arr // store random data
		for (let y = 0; y < 10; y++) { cache.arr = cache.arr.concat(cache.arr) } // increase size
		pcmData = new Float32Array(cache.arr) // convert back to Float32Array
		delete cache.arr // free memory
		randomized.browser.getChannelData = ['AudioBuffer.getChannelData', hashify(JSON.stringify(randomChannelData))]
		return () => pcmData
	}
	const webglRenderer = () => {
		//https://www.primegrid.com/gpu_list.php
		const renderers = [
			{
				gpu: 'NVIDIA GeForce RTX',
				model: [
					'2080 SUPER',
					'2080 Ti',
					'2080',
					'2070 SUPER',
					'2070',
					'2060'
				]
			},
			{	
				gpu: 'NVIDIA GeForce GTX',
				model: [
					'1080 Ti',
					'1080',
					'1070 Ti',
					'1070',
					'1660 Ti',
					'1660',
					'1650',
					'1060',
					'1050 Ti',
					'1050'
				]
			},
			{
				gpu: 'AMD Radeon',
				model: [
					'VII',
					'HD 7950 Compute Engine',
					'(TM) R9 Fury Series', 
					'Pro 580 Compute Engine',
					'RX 570 Compute Engine', 
					'(TM) RX Vega 11 Graphics',
					'RX Vega 56 Compute Engine'
				]
			},
			{
				gpu: 'Radeon',
				model: [
					'RX Vega',
					'RX 580 Series',
					'RX 570 Series',
					'RX 560 Series',
					'(TM) RX 480 Graphics'
				] 
			}
		]
		const getParameter = WebGLRenderingContext.prototype.getParameter
		const randomRenderer = listRand(renderers)
		const randomGpu = randomRenderer.gpu
		const randomModel = listRand(randomRenderer.model)
		const randomizedRenderer = `${randomGpu} ${randomModel}`
		const extension = { 37446: `ANGLE (${randomizedRenderer} vs_${rand(1,5)}_0 ps_${rand(1,5)}_0)` }
		randomized.device.getParameter = ['WebGL Renderer', randomizedRenderer]
		return function(x) { return extension[x]? extension[x]: getParameter.apply(this, arguments) }
	}
	// randomized & cached: prevent recompute on property reads
	const cachedRandomized = {
		doNotTrack: randomizify('browser', 'doNotTrack', doNotTrack()),
		maxTouchPoints: randomizify('device', 'maxTouchPoints', maxTouchPoints(), canLieTouchComputed()),
		hardwareConcurrency: randomizify('device', 'hardwareConcurrency', hardwareConcurrency()),
		deviceMemory: randomizify('device', 'deviceMemory', deviceMemory()),
		screenWidth: randomizify('device', 'screen.width', screenFingerprintComputed().w),
		screenHeight: randomizify('device', 'screen.height', screenFingerprintComputed().h),
		screenAvailWidth: randomizify('device', 'screen.availWidth', screenFingerprintComputed().asrw),
		screenAvailHeight: randomizify('device', 'screen.availHeight', screenFingerprintComputed().asrh),
		screenColorDepth: randomizify('device', 'screen.colorDepth', screenFingerprintComputed().cDepth),
		screenPixelDepth: randomizify('device', 'screen.pixelDepth', screenFingerprintComputed().pDepth),
		canvasDataURL: canvasDataURL(),
		audioBufferChannelData: audioBufferChannelData(),
		webglRenderer: webglRenderer()
	}
	randomizationTime(`⏱Randomization complete`)
	// blocked
	const blocked = { browser: {}, device: {} }
	const blockify = (env, prop, val, canLie = true) => {
		if (canLie) { blocked[env][prop] = [prop, (val !== ''? JSON.stringify(val): "''")] }
		return () => val
	}
	const resolvedOptionsTimeZone = () => {
		const options = Intl.DateTimeFormat().resolvedOptions()
		options.timeZone = 'UTC'
		blocked.device.timeZone = ['timeZone', 'UTC']
		return () => options
	}
	// blocked & cached: prevent recompute on property reads
	const cachedBlocked = {
		mimeTypes: blockify('browser', 'mimeTypes', []),
		plugins: blockify('browser', 'plugins', []),
		vendor: blockify('browser', 'vendor', ''),
		getVoices: blockify('browser', 'getVoices', []),
		connection: blockify('device', 'connection', undefined),
		getBattery: blockify('device', 'getBattery', undefined),
		getGamepads: blockify('device', 'getGamepads', []),
		resolvedOptionsTimeZone: resolvedOptionsTimeZone(),
		timezoneOffset: blockify('device', 'timezoneOffset', 0),
		createDataChannel: blockify('device', 'RTCPeerConnection.createDataChannel', undefined),
		createOffer: blockify('device', 'RTCPeerConnection.createOffer', undefined),
		setRemoteDescription: blockify('device', 'RTCPeerConnection.setRemoteDescription', undefined)
	}
	// structs
	const navigatorProps = {
		appVersion: navigator.appVersion,
		appCodeName: navigator.appCodeName,
		deviceMemory: cachedRandomized.deviceMemory(),
		doNotTrack: cachedRandomized.doNotTrack(),
		hardwareConcurrency: cachedRandomized.hardwareConcurrency(),
		languages: navigator.languages,
		maxTouchPoints: canLieTouchComputed()? cachedRandomized.maxTouchPoints(): navigator.maxTouchPoints,
		mimeTypes: cachedBlocked.mimeTypes(),
		platform: navigator.platform,
		plugins: cachedBlocked.plugins(),
		userAgent: navigator.userAgent,
		vendor: cachedBlocked.vendor(),
		connection: cachedBlocked.connection()
	}
	if ('getBattery' in navigator) { navigatorProps.getBattery = () => cachedBlocked.getBattery() }
	if ('getGamepads' in navigator) { navigatorProps.getGamepads = () => cachedBlocked.getGamepads() }
	const screenProps = {
		width: cachedRandomized.screenWidth,
		height: cachedRandomized.screenHeight,
		availWidth: cachedRandomized.screenAvailWidth,
		availHeight: cachedRandomized.screenAvailHeight,
		availTop: screen.availTop,
		availLeft: screen.availLeft,
		colorDepth: cachedRandomized.screenColorDepth,
		pixelDepth: cachedRandomized.screenPixelDepth
	}
	const dateProps = {
		getTimezoneOffset: () => cachedBlocked.timezoneOffset()
	}
	const intlProps = {
		resolvedOptions: () => cachedBlocked.resolvedOptionsTimeZone()
	}
	const mathProps = {
		acos: Math.acos,
		acosh: Math.acosh,
		asin: Math.asin,
		asinh: Math.asinh,
		cosh: Math.cosh,
		expm1: Math.expm1,
		sinh: Math.sinh
	}
	const mediaDeviceProps = {
		enumerateDevices: navigator.mediaDevices.enumerateDevices
	}
	const videoElementProps = {
		canPlayType: HTMLVideoElement.prototype.canPlayType
	}
	const mediaElementProps = {
		canPlayType: HTMLMediaElement.prototype.canPlayType
	}
	const mediaSourceProps = {
		isTypeSupported: MediaSource.isTypeSupported
	}
	const mediaRecorderProps = {
		isTypeSupported: MediaRecorder.isTypeSupported
	}
	const speechProps = {
		getVoices: () => cachedBlocked.getVoices()
	}
	const performanceProps = {
		now: performance.now
	}
	const elemRectProps = {
		getBoundingClientRect: Element.prototype.getBoundingClientRect,
		getClientRects: Element.prototype.getClientRects
	}
	const rangeRectProps = {
		getBoundingClientRect: Range.prototype.getBoundingClientRect,
		getClientRects: Range.prototype.getClientRects
	}
	const webglProps = {
		shaderSource: WebGLRenderingContext.prototype.shaderSource,
		getExtension: WebGLRenderingContext.prototype.getExtension,
		getParameter: cachedRandomized.webglRenderer,
		getSupportedExtensions: WebGLRenderingContext.prototype.getSupportedExtensions
	}
	const canvasProps = {
		toDataURL: () => cachedRandomized.canvasDataURL(),
		toBlob: HTMLCanvasElement.prototype.toBlob
	}
	const canvasContextProps = {
		getImageData: CanvasRenderingContext2D.prototype.getImageData,
		isPointInPath: CanvasRenderingContext2D.prototype.isPointInPath,
		isPointInStroke: CanvasRenderingContext2D.prototype.isPointInStroke,
		measureText: CanvasRenderingContext2D.prototype.measureText,
	}
	const audioProps = {
		createAnalyser: AudioContext.prototype.createAnalyser,
		createOscillator: AudioContext.prototype.createOscillator,
	}
	const audioBufferProps = {
		getChannelData: () => cachedRandomized.audioBufferChannelData(),
		copyFromChannel: AudioBuffer.prototype.copyFromChannel
	}
	const webRTCProps = {
		createDataChannel: () => cachedBlocked.createDataChannel(),
		createOffer: () => cachedBlocked.createOffer(),
		setRemoteDescription: () => cachedBlocked.setRemoteDescription()
	}
	// Log Randomized & Blocked
	const style = `color:aaa;background:#e2d7d752`
	const randomizedBrowserKeys = Object.keys(randomized.browser)
	const randomizedDeviceKeys = Object.keys(randomized.device)
	const blockedBrowserKeys = Object.keys(blocked.browser)
	const blockedDeviceKeys = Object.keys(blocked.device)
	const hash = hashify(JSON.stringify(randomized))
	console.group(
		`🧪Randomized ${randomizedBrowserKeys.length+randomizedDeviceKeys.length} properties (id: ${hash})`
	)
		console.group('Browser')
		randomizedBrowserKeys.forEach(key => {
			const prop = randomized.browser[key][0]
			const val = randomized.browser[key][1]
			console.log(`%c${prop}: ${val}`, style)
		})
		console.groupEnd()
		console.group('Device')
		randomizedDeviceKeys.forEach(key => {
			const prop = randomized.device[key][0]
			const val = randomized.device[key][1]
			console.log(`%c${prop}: ${val}`, style)
		})
		console.groupEnd()
	console.groupEnd()
	console.groupCollapsed(
		`🔌Blocked ${blockedBrowserKeys.length+blockedDeviceKeys.length} properties`
	)
		console.group('Browser')
		blockedBrowserKeys.forEach(key => {
			const prop = blocked.browser[key][0]
			const val = blocked.browser[key][1]
			console.log(`%c${prop}: ${val}`, style)
		})
		console.groupEnd()
		console.group('Device')
		blockedDeviceKeys.forEach(key => {
			const prop = blocked.device[key][0]
			const val = blocked.device[key][1]
			console.log(`%c${prop}: ${val}`, style)
		})
		console.groupEnd()
	console.groupEnd()
	// API with Ranking per Unique Impact and Longterm State
	const queryAPI = 'https://developer.mozilla.org/en-US/search?q='
	const propAPI = {
		appVersion: ['navigator.appVersion', 2],
		appCodeName: ['navigator.appCodeName', 1],
		deviceMemory: ['navigator.deviceMemory', 1],
		doNotTrack: ['navigator.doNotTrack', 1],
		hardwareConcurrency: ['navigator.hardwareConcurrency', 1],
		languages: ['navigator.languages', 1],
		maxTouchPoints: ['navigator.maxTouchPoints', 1],
		mimeTypes: ['navigator.mimeTypes', 1],
		platform: ['navigator.platform', 1],
		plugins: ['navigator.plugins', 1],
		userAgent: ['navigator.userAgent', 2],
		vendor: ['navigator.vendor', 1],
		connection: ['navigator.connection', 1],
		getBattery: ['navigator.getBattery', 1],
		getGamepads: ['navigator.getGamepads', 1],
		width: ['screen.width', 1],
		height: ['screen.height', 1],
		availWidth: ['screen.availWidth', 1],
		availHeight: ['screen.availHeight', 1],
		availTop: ['screen.availTop', 1],
		availLeft: ['screen.availLeft', 1],
		colorDepth: ['screen.colorDepth', 1],
		pixelDepth: ['screen.pixelDepth', 1],
		getTimezoneOffset: ['Date.prototype.getTimezoneOffset', 1],
		resolvedOptions: ['Intl.DateTimeFormat.prototype.resolvedOptions', 2],
		acos: ['acos: Math.acos', 1],
		acosh: ['Math.acosh', 1],
		asin: ['Math.asin', 1],
		asinh: ['Math.asinh', 1],
		cosh: ['Math.cosh', 1],
		expm1: ['Math.expm1', 1],
		sinh: ['Math.sinh', 1],
		enumerateDevices: ['navigator.mediaDevices.enumerateDevices', 1],
		canPlayType: ['prototype.canPlayType', 1],
		isTypeSupported: ['isTypeSupported', 1],
		getVoices: ['speechSynthesis.getVoices', 1],
		now: ['performance.now', 1],
		getBoundingClientRect: ['prototype.getBoundingClientRect', 2],
		getClientRects: ['prototype.getClientRects', 2],
		offsetWidth: ['HTMLElement.prototype.offsetWidth', 1],
		offsetHeight: ['HTMLElement.prototype.offsetHeight', 1],
		shaderSource: ['WebGLRenderingContext.prototype.shaderSource', 6],
		getExtension: ['WebGLRenderingContext.prototype.getExtension', 2],
		getParameter: ['WebGLRenderingContext.prototype.getParameter', 2],
		getSupportedExtensions: ['WebGLRenderingContext.prototype.getSupportedExtensions', 4],
		toDataURL: ['HTMLCanvasElement.prototype.toDataURL', 6],
		toBlob: ['HTMLCanvasElement.prototype.toBlob', 6],
		getImageData: ['CanvasRenderingContext2D.prototype.getImageData', 6],
		isPointInPath: ['CanvasRenderingContext2D.prototype.isPointInPath', 1],
		isPointInStroke: ['CanvasRenderingContext2D.prototype.isPointInStroke', 1],
		measureText: ['CanvasRenderingContext2D.prototype.measureText', 1],
		font: ['CanvasRenderingContext2D.prototype.font', 1],
		createAnalyser: ['AudioContext.prototype.createAnalyser', 6],
		createOscillator: ['AudioContext.prototype.createOscillator', 6],
		getChannelData: ['AudioBuffer.prototype.getChannelData', 6],
		copyFromChannel: ['AudioBuffer.prototype.getChannelData', 6],
		createDataChannel: ['RTCPeerConnection.prototype.createDataChannel', 6],
		createOffer: ['RTCPeerConnection.prototype.createOffer', 6]
	}
	// watcher
	let watchAll = true
	let rankCounter = 0
	const warningRank = 12
	const propsRead = []
	const propsReadAll = {}
	const scripts = []
	const watch = (prop) => {
		const url = getCurrentScript()
		const propDescription = propAPI[prop][0]
		const fpRank = propAPI[prop][1]
		const headingStyle = `background:#bcf4de73`
		const warnStyle = `color:red;border:1px solid red;font-weight:bold;padding:2px;`
		const tracedScript = scripts.filter(s => s.url == url)[0]
		const traceFirstRead = () => {
			console.groupCollapsed(`Script read ${propDescription}`)
			console.log(`Script:https:${url}`)
			console.log('API:'+queryAPI+propDescription)
			console.groupEnd()
		}
		const newPropRead = !itemInList(propsRead, propDescription)
		propsReadAll[propDescription]? propsReadAll[propDescription]++: propsReadAll[propDescription]=1
		if (newPropRead) { rankCounter += fpRank; propsRead.push(propDescription) }
		if (watchAll && rankCounter >= warningRank) {
			const caution = `Excessive property reads detected!`
			console.log('%c'+caution, warnStyle)
			console.log('Total property reads:', propsReadAll)
			console.log('Scripts: ', scripts)
			document.title = '🤢'+document.title
			watchAll = false
		}
		if (!tracedScript) {
			scripts.push({ url, fpRank, reads: [propDescription], all: { [propDescription]: 1 }, creep: false })
		}
		else if (!itemInList(tracedScript.reads, propDescription)) {
			tracedScript.fpRank += fpRank // update on 1st prop read
			tracedScript.reads.push(propDescription)
			tracedScript.all[propDescription]=1
			// detect
			if (!tracedScript.creep && tracedScript.fpRank >= warningRank) {
				const warning = `Fingerprinting detected!`
				const randStr = (Math.random() + 1).toString(36).substring(2,8)
				const message = '🤮'+warning+' OK to allow or Cancel to try abort.\n\n'+tracedScript.reads.join('\n')+'\n...'
				tracedScript.creep = true
				console.log('%c'+warning, warnStyle)
				console.log(`Creepy script: https:${url}`)
				console.log(`Total property reads:`, tracedScript.all)
				console.groupCollapsed(`Resource Links:`)
				console.log(Resourcelinks)
				console.groupEnd()
				//alert(message)
				if (!confirm(message)) { throw new ReferenceError(randStr) }
			}
		}
		else { tracedScript.all[propDescription]++ }
		return options.traceFirstRead && newPropRead? traceFirstRead: ()=>{}
	}
	// difinify
	function definify(struct) {
		const redefinedProps = {}
		Object.keys(struct).forEach(prop => {
			redefinedProps[prop] = { get: () => { watch(prop)(); return struct[prop] } }
		})
		return redefinedProps
	}
	function redefine(root) {
		Object.defineProperties(root.navigator, definify(navigatorProps))
		Object.defineProperties(root.screen, definify(screenProps))
		Object.defineProperties(root.Date.prototype, definify(dateProps))
		Object.defineProperties(root.Intl.DateTimeFormat.prototype, definify(intlProps))
		Object.defineProperties(root.Math, definify(mathProps))
		Object.defineProperties(root.navigator.mediaDevices, definify(mediaDeviceProps))
		Object.defineProperties(root.HTMLVideoElement.prototype, definify(videoElementProps))
		Object.defineProperties(root.HTMLMediaElement.prototype, definify(mediaElementProps))
		Object.defineProperties(root.MediaSource, definify(mediaSourceProps))
		Object.defineProperties(root.MediaRecorder, definify(mediaRecorderProps))
		Object.defineProperties(root.speechSynthesis, definify(speechProps))
		Object.defineProperties(root.performance, definify(performanceProps))
		Object.defineProperties(root.Element.prototype, definify(elemRectProps))
		Object.defineProperties(root.Range.prototype, definify(rangeRectProps))
		Object.defineProperties(root.WebGLRenderingContext.prototype, definify(webglProps))
		Object.defineProperties(root.HTMLCanvasElement.prototype, definify(canvasProps))
		Object.defineProperties(root.CanvasRenderingContext2D.prototype, definify(canvasContextProps))
		Object.defineProperties(root.AudioContext.prototype, definify(audioProps))
		Object.defineProperties(root.AudioBuffer.prototype, definify(audioBufferProps))
		Object.defineProperties(root.RTCPeerConnection.prototype, definify(webRTCProps))
	}
	const redefineTime = timer(`🔨Redefining properties...`)
	redefine(window)
	redefineTime(`⏱Redefining complete`)
	if(options.injectFrames) {
		domLoaded(() => {
			;[...document.getElementsByTagName('iframe')].forEach(frame => redefine(frame.contentWindow))
		})
	}
})()
