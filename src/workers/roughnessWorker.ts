// import { Roughness } from '../xentonality/roughness'

// let roughness: Roughness
// let options: unknown

// export type RoughnessWorkerPostMessage = {
//     type: 'error' | 'success'
//     payload: unknown
// }

// function respond(message: RoughnessWorkerPostMessage) {
//     postMessage(message)
// }

// onmessage = function (message) {
//     const { type, payload } = JSON.parse(message.data)

//     if (type === 'update') {
//         try {
//             if (!payload) throw new Error("RoughnessWorker: No payload on 'update' message!")

//             if (!payload?.partials || !payload?.partials?.length) throw new Error("RoughnessWorker: Invalid payload on 'update' message!")

//             if (roughness === undefined) {
//                 roughness = new Roughness(payload)
//             } else {
//                 console.log(payload)
//                 roughness.update(payload)
//             }

//             respond({ type: 'success', payload: { profile: roughness.profile.value, limits: roughness.limits } })
//         } catch (error) {
//             respond({ type: 'error', payload: error })
//             return
//         }
//     }
// }
