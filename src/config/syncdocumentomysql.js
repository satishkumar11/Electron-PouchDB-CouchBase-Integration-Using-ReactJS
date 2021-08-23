function OnUpdate(doc, meta) {
    var request = {
        path: '/add',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "doc": doc
        }
    };

    try {
        if (Object.keys(request.body.doc).length > 0) {
            if ('data' in request.body.doc) {
                log("calling api for transaction data : " + JSON.stringify(request));
                var response = curl('PUT', backend, request);
                log("action completed : " + JSON.stringify(response));
            }
        }
    } catch (err) {
        log("error occured while calling the api : " + err);
    }
}