import { ReactDOM, Component, useReducer, useState } from "../which-react";

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { counter: state.counter + 1 }
    default:
      break;
  }
  return state
}

function FunctionComponent(props) {
  const [state, dispatch] = useReducer(reducer, { counter: 1 })
  const [num, setNum] = useState(0)
  return (
    <div>
      <div>{props.name}</div>
      <div>counter：{ state.counter }</div>
      <button onClick={ () => dispatch({ type: 'increment' }) }>counter+1</button>
      <div>num：{num}</div>
      <button onClick={ () => setNum(num + 1) }>num+1</button>
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div>
        <div>{this.props.name}</div>
        我是文本
      </div>
    );
  }
}

const jsx = (
  <div className="border">
    <h1>react</h1>
    <a href="https://github.com/phm-front/mini-react">mini react</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <>
      <h3>title</h3>
    </>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(jsx);
