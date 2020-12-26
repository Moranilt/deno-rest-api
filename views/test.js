
const Test = () => {
    const [count, setCount] = React.useState(0)
    const products = () => {
        axios.get('/api/v1/products').then(response => {
            console.log(response.data)
        })
    }
    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => products()}>Click</button>
        </div>
    )
}

ReactDOM.render(React.createElement(Test), document.getElementById('app'))