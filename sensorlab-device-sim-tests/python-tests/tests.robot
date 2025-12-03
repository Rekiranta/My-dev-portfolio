*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
${BASE}    http://server:8092

*** Test Cases ***
Health Check Works
    Create Session    api    ${BASE}
    ${resp}=    GET On Session    api    url=/health
    Should Be Equal As Integers    ${resp.status_code}    200
    ${body}=    Set Variable    ${resp.json()}
    Dictionary Should Contain Key    ${body}    ok
    Should Be True    ${body}[ok]

Create Device, Calibrate And Get Deterministic Reading
    Create Session    api    ${BASE}

    # Luodaan device JSON-dictinä -> ei ylimääräisiä lainausmerkkejä bodyyn
    &{payload}=    Create Dictionary    name=Demo Device    seed=999
    ${create}=    POST On Session    api    url=/api/devices    json=${payload}
    Should Be Equal As Integers    ${create.status_code}    201
    ${device}=    Set Variable    ${create.json()}
    ${id}=    Set Variable    ${device}[id]

    # Kalibrointi
    &{calPayload}=    Create Dictionary    offsetC=1.5
    ${cal}=    POST On Session    api    url=/api/devices/${id}/calibrate    json=${calPayload}
    Should Be Equal As Integers    ${cal.status_code}    200

    # Deterministinen lukema tietyllä timestampilla
    ${r1}=    GET On Session    api    url=/api/devices/${id}/reading?at=1700000000
    Should Be Equal As Integers    ${r1.status_code}    200
    ${body}=    Set Variable    ${r1.json()}
    Dictionary Should Contain Key    ${body}    reading
    Dictionary Should Contain Key    ${body}[reading]    temperatureC