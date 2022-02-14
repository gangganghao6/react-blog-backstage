import {testContext} from "../App";
import {useContext} from "react";
import {Button} from "antd";

export default function () {
    const {state, dispatch} = useContext(testContext);
    return (
        <div>
            Count: {state.count}
            <Button type={'primary'} onClick={() => dispatch({type: "decrement", value: -5})}>-</Button>
            <Button type={'primary'} onClick={() => dispatch({type: "increment", value: 5})}>+</Button>
        </div>
    )
        ;
}
