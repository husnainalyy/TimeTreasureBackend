const asyncHandler = (requestHandelr) => {
    return (req, res, next) => {
        Promise.resolve(requestHandelr(req, res, next)).catch((error) => next(error))
    }
}

export { asyncHandler }