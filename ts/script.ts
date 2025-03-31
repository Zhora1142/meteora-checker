import {check} from "./checker";

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('check-button') as HTMLButtonElement | null;
    const input = document.getElementById('address-input') as HTMLInputElement | null;
    const messageBox = document.getElementById('message-box') as HTMLElement | null;

    if (!button || !input || !messageBox) {
        console.error('Один или несколько элементов не найдены');
        return;
    }

    button.addEventListener("click", async function () {
        const address = input.value.trim()

        if (!address) {
            messageBox.textContent = "Необходимо ввести адрес";
            return
        }

        button.disabled = true;

        await check(address, messageBox);

        button.disabled = false;
    })
})