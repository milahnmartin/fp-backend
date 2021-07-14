export interface response {
    STATUS: boolean,
    REASON: string
}

export interface new_status {
    status: boolean,
    secret_token?: string

}


export interface update_status {
    status: boolean,
    reason?: string,
    token?: string,
    name: string
}