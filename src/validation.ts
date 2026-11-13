import type { Priority, Result } from "./models.js";

export function parseTitle(value: unknown): Result<string> {
    if (typeof value !== "string") {
        return {
            ok: false,
            error: "Заголовок должен быть быть строкой"
        }
    }

    const trimmedTitle = value.trim()

    if (trimmedTitle.length < 1 || trimmedTitle.length > 80) {
        return {
            ok: false,
            error: "Недопустимая длина заголовка. Должна быть от 1 до 80 символов"
        }
    }

    return {
        ok: true,
        value: trimmedTitle
    }
}

export function parsePriority(value: unknown): Result<Priority> {
    if (typeof value !== "string") {
        return {
            ok: false,
            error: "Приоритет должен быть строкой"
        }
    }

    if (value !== "low" && value !== "normal" && value !== "high") {
        return {
            ok: false,
            error: "Недопустимое значение приоритета. Допустимые значения: 'low', 'normal', 'high'"
        }
    }

    return {
        ok: true,
        value: value
    }
}