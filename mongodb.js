
const { MongoClient, ObjectId } = require('mongodb')

// Path: mongodb.js
const url = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const mongoose = require('mongoose')
mongoose.connect(url)



// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
// const db = client.db(databaseName)


// db.collection('users').findOne({_id: new ObjectId("649c562f13cbbea8d9553ffd")}).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// }  )

// db.collection('users').find({age: 27}).toArray().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// }  )

// db.collection('tasks').findOne({_id: new ObjectId("6499acc63507d14d072f03f9")}).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// db.collection('tasks').find({completed: false}).toArray().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// db.collection('users').updateOne({_id : new ObjectId("6499a7ce63230ab3c990725f")}, {
//     $inc: {
//         age: 1
//     }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })\

db.collection('tasks').deleteOne({description: "job"}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})