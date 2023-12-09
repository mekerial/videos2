import {app} from './settings'

const port = 3002;
export { app };

app.listen(port, () => {
    console.log(`listen on port ${port}`)
})


