// Импортирвоал типы для телеграм
const tg = window.Telegram.WebApp;

function useTelegram() {

    const onAppClose = () => {
        tg.close()
    };

    const initData = tg.initDataUnsafe;

    const user = initData?.user;
    const queryId = initData?.query_id;
    const userPhoto = initData?.user?.photo_url;
    if (user == undefined || queryId == undefined) {
        throw new Error("Telegram init data is not available");
    }

    return {
        onAppClose,
        tg,
        user,
        queryId,
        userPhoto,
    }
}

export default useTelegram;
