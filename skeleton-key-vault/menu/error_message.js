export function formatErrorMessage(err) {
    if (err.code === 'EACCES') {
        return "Permission Denied. The folder is locked or owned by another user. Try running 'chmod 755' on the project folder.";
    }
    if (err.code === 'ENOENT') {
        return "Directory not found. Please ensure the folder structure exists.";
    }
    return err.message;
}
