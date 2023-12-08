import {app} from './settings'

const port = 80;
export { app };

app.listen(port, () => {
    console.log(`listen on port ${port}`)
})


