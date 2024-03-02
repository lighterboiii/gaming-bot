const tg = (window as any).Telegram.WebApp;

function useTelegram() {

    const onAppClose = () => {
        tg.close()
    };

    return {
        onAppClose,
        tg,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
    }
};

export default useTelegram;