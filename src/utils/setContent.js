
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Spinner from '../components/spinner/Spinner';
import Skeleton from "../components/skeleton/Skeleton"

const setContent = (process, Component, data) => {
    switch (process) {
        case "waiting":
            return <Skeleton />;
            break;
        case "loading":
            return <Spinner />;
            break;
        case "confirmed":
            return <Component data={data} />
            break;
        case "error":
            <ErrorMessage />
            break;
        default:
            throw new Error("Unexpected process state");
    }
}

export default setContent;