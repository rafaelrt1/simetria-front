import { Alert, Snackbar } from "@mui/material";

const FeedbackMessage = (props) => {
    const handleClose = () => {};
    return props.message.visible ? (
        <>
            <Snackbar
                open={props.message.visible}
                autoHideDuration={props.hideTime}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={props.message.messageType}
                    sx={{ width: "100%" }}
                >
                    {props.message.message}
                </Alert>
            </Snackbar>
        </>
    ) : null;
};

export default FeedbackMessage;
