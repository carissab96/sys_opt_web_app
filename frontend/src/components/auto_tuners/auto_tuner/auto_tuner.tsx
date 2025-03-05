import useEffect = require("react").useEffect;
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchSystemMetrics } from "../../../../store/slices/metricsSlice";
import { AutoTuner } from "./AutoTuner";

export const AutoTuner: React.FC = () => {
    const dispatch = useAppDispatch();
    const metrics = useAppSelector(state => state.metrics.data);
    
    useEffect(() => {
        dispatch(fetchSystemMetrics());
    }, [dispatch]);
    
    return (
        <div>
            <h1>Auto Tuner</h1>
            <p>Auto tuner content goes here</p>
        </div>
    );
};