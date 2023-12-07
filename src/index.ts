import {app} from './settings'

const port = 80;

app.listen(port, () => {
    console.log(`listen on port ${port}`)
})
