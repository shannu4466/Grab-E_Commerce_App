import { useState, useEffect, useCallback } from 'react'

export function useFetch<T>(url: string) {
    const [apiData, setApiData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<unknown>("")

    const fetchData = useCallback(async () => {
        if (!url) return
        setLoading(true)

        try {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP error. status: ${res.status}`)
            const data = await res.json()
            setApiData(data)
        } catch (e: unknown) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [url])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { apiData, loading, error, fetchData }
}