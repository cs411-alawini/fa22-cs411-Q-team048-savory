import {useSelector, useDispatch} from 'react-redux'
import { callAPI, counterSelector, decrementCount, incrementCount } from './CounterSlice';

export default function Counter() {
    const dispatch = useDispatch();
    const ct = useSelector(counterSelector);
    return (
        <div>
            <button onClick={() => dispatch(incrementCount())}>Add</button>
            <div>{ct.count}</div>
            <button onClick={() => dispatch(decrementCount())}>Subtract</button>
            <div style={{marginTop: "30px"}}>
            <button onClick={() => dispatch(callAPI())}>Make API Call</button>
            <div>{ct.apiResult}</div>
            </div>
        </div>
    );
}