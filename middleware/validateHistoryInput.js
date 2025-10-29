function validateHistoryInput(req, res, next) {
    const accountId = req.params.accountId;

    if (isNaN(Number(accountId))) {
        return res.status(400).json({ error: 'Invalid account id' });
    }

    next();
}


module.exports = validateHistoryInput;