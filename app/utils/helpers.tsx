import { placeholderRegex } from "./constants";
import { FormField } from "./types";

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        // Clear the previous timeout
        clearTimeout(timeout);

        // Set a new timeout to call the function after the wait time
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

//prepare filled html
export const getHtmlWithPlaceholders = (content: string, formFields: FormField[]) => {
    return content.replace(placeholderRegex, (match, label, key) => {
      key = key.trim();
      return `<span style='display:inline-block; border: 1px; border-bottom-style: dashed; padding: 1px; min-width: 100px;'>${formFields.find(field => field.key === key)?.value}</span>`;
    });
  };

  //prepare interactive html
export const getHtmlWithInputs = (content: string, formFields: FormField[]) => {
    return content.replace(placeholderRegex, (match, label, key) => {
      label = label.trim();
      key = key.trim();
      return `<span class='container'>`
        + `<button class='overlay-button' data-key="${key}">${label}</button>`
        + `<span class='overlay-span'>${formFields.find(field => field.key === key)?.value}</span>`
        + `</span>`;
    });
  }