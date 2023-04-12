import { translate } from '@vitalets/google-translate-api';

export async function translateMessage(message: string, tgtLang: string) {
    let translated = await translate(message, { to: tgtLang });
    console.log(translated.text);
    return translated.text
}