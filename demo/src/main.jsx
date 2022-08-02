import { ReactDOM, Component } from "../which-react";

function FunctionComponent(props) {
  return <div>{props.name}</div>;
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
