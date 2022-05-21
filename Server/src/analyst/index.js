
const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT('analystapi@analystapi.iam.gserviceaccount.com', null, 
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVODWxF2Ad+Z+b\nyhb5Kl10k3jRaacpU4uYZ1176BaUTuxhyzsvCmDcHGij3FrlecmflidsDZlRQoVT\n9Zw/gEH4dUfX5MuUpp0p26si0G5ecJw7gtSQbrf8HILLnxaFPaAJ0BQ7LMHjYgHD\nubQt74G45GGYm2MXIl4NE01+8Pq0ptQCZUbSuuRX4P7T6LuZI2VRDsl6Fqb2kWOX\nezNFn74AVV84EAjjBziIATmkjLaMW75L7bYsQzlLDtJl03QXsjsvv9/R7W7xRgh9\nkNLVkg3kY9MG1EFqQeu5KfZEUEwKbsyDrQK4HeqxijWoSPe1LlpCj3/CG+n9k3xM\n7lK7xIffAgMBAAECggEAEmC3YCWwXVC6ox3LIYnhs7Nb/HKmN1VGSpFkdpe5fC+S\nNmMo2VzOXB2Vl6TSfxO2TNTZ6xlrqhHmyNXllf6OYXLUU9cmaZrxnU+kLqf8B96X\np06wLk+skjzSsRBZXjSeSscZTsZu5LnT3M64zbWDRQm/qWNt21IMwlB/yWQVhH0d\nPRPk4FLwehtmC6ZLJXtG5BCcKGKALdybwybds2FrX3aamixJOQeVipt78pK1f5HG\nGagH37/82D7lQIv4bukkD3OQIcc3vLTNq2HDC7OCES4tvpsh0/SHoPzY3AnS4jIP\nVuzaV9a9gmsz0lzviTcl3oZNNlTysMCO/VnJzv4WIQKBgQDQt2CmkgFhTMoc1tLW\njGP8wwPej8Pr1gm+8R7LPwaq577j/L9HgfeLkCEK9G5NQDXzi1+0dCd6IHpsrPCb\nBB3jN5bdpbOAe0vgWLyNjJwJBKQ+rNOKKwgh9Otn2DnXhVMtqCir3RcWSn0z6+It\nIYrpMEkeq8MYtxaD76l7wyr//wKBgQC3Bki9G6NVHcY9F8Ok9TNaLSoakdAq9sQT\nOKY/QyAJSJNe/sWqdDVSKGKlhyrz9AvbvRPdiZ3IEj7Xkg7a85dLT8HhKS+vwnnm\nKuezBn9PuBQ7uf8t/awTdZqeUNpvIKXG0h9ss8JLimh0Kshi4/yH3r75TnrpfAyr\njL1flMZ4IQKBgQCwk4O0SG/cdo/DaEeFdc6dqAsc/rn9St6B6RJpVw/4BQntbgYR\npDXen/gkgXjT6E/8lFxKmb5QRyvrxz/jlc8HTR9Ys3gyaZ1e1xPmGSBlTMT7tVFe\nYluGBuQlvbvpxwUA6nRGOkzu8eQMyjJWhjs0X0JtLVloDnWA94CGkS5O1wKBgHUq\n1bgSkG52ACmuI/Zfbr+E+FZIEI7gqMdxVaRcMY8f4hBHY31qpZPx/KzhKlNAYbML\niUMizVp+q7JPc6khljKFXaXqOvf2tRjvUKMgPrJnMrTFrqHfqqBOgmxlcGEB8n6k\nl698KJ85fQMZPG1qbIkCxRlO74q3elj8YWNmF+RhAoGAM99j+tcrNmXMK2+FKen1\npwxic0N1hFV4T3cBgYk0aQoSOQdw3Okc9oV0/BKKMxRG+1MetT6H1/s+tSZvLP5g\n2QRxeC9cTJ32E6WKYfNcfZwX8WwzLc3p9MKVxYbiT7WH6S9q9Q5OFu7KJvQqnz2R\n/ObvwEKHCuHQtsW+R8RAuhA=\n-----END PRIVATE KEY-----\n",
     scopes)
const view_id = `XXXXX`


async function getData() {
const response = await jwt.authorize()
const result = await google.analytics('v3').data.ga.get({
'auth': jwt,
'ids': 'ga:' + view_id,
'start-date': '30daysAgo',
'end-date': 'today',
'metrics': 'ga:pageviews'
})

console.dir(result)
}


