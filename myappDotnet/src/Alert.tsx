

type Props = {
    type?: Array<string> | string;
    heading: string;
    children: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
}
const Alert = ({ type, heading = "default title", children, closable, onClose }: Props) => {


    return (
        <div className="App">
            <h1>{type}</h1>
            <h2>{type === "warning" ? children : "cuong ga"}</h2>
        </div>
    );
};

export default Alert;
