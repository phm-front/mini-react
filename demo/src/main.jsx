import { ReactDOM, Component, useReducer, useState } from "../which-react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { counter: state.counter + 1 };
    default:
      break;
  }
  return state;
}
let nums = [0, 1, 2, 3, 4];
function FunctionComponent(props) {
  const [state, dispatch] = useReducer(reducer, { counter: 1 });
  const [count2, setCount2] = useState(0);
  return (
    <div>
      <div>{props.name}</div>
      <div>counter：{state.counter}</div>
      <button onClick={() => dispatch({ type: "increment" })}>counter+1</button>
      <button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        {count2}
      </button>

      {/* {count % 2 ? <div>omg</div> : <span>123</span>} */}

      <ul>
        {/* {count2 === 2
          ? [0, 1, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })
          : [0, 1, 2, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })} */}

        {count2 === 2
          ? [2, 1, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })
          : [0, 1, 2, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })}
      </ul>
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
