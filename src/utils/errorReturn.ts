import { AxiosError } from "axios"

export const errorReturn = (error: unknown) => {
    if (error instanceof AxiosError) {
        return error.response?.data.message
    } else if (error instanceof Error) {
        return error.message
    }
    return "An unknown error occurred"
}