export interface response {
    STATUS: boolean,
    REASON: string
}

export interface new_status {
    status: boolean,
    secret_token?: string

}