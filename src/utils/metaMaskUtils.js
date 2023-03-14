import Web3 from "web3";
import {message} from "antd";

export async function initMetaMask({
                                       status,
                                       connect,
                                       account,
                                       chainId,
                                       ethereum,
                                       switchChain
                                   }, setWeb3, setBalance, setLastUpdated, setNodeVersion) {
    switch (status) {
        case "unavailable":
            message.error("尚未安装 MetaMask")
            break;
        case "notConnected":
            message.info("正在连接到 MetaMask")
            try {
                await connect()
            } catch (e) {
                console.log(e)
            }
            break;
        case "connected":
            message.success("已连接到 MetaMask")
            if (chainId !== '0x5') {
                await switchToGoerli({switchChain})
            }
            const web3 = new Web3(ethereum)
            const nodeVersion = await web3.eth.getNodeInfo()
            const balance = await getBalance({account}, web3)()
            setNodeVersion(nodeVersion)
            setWeb3(web3)
            setBalance(balance)
            setLastUpdated(+new Date())
            break;
    }
}

export function switchToGoerli({switchChain, chainId}) {
    return async () => {
        if (chainId === '0x5') {
            message.info("已经是 Goerli测试网络")
        } else {
            message.info("正在切换至 Goerli测试网络")
            await switchChain("0x5")
            message.success("切换成功")
        }
    }
}

export function getBalance({account}, web3) {
    return async () => {
        return await web3.eth.getBalance(account)
    }
}

export function startTransfer({account, chainId}, web3, value, address, unit, setIsModalOpen, setTransactionAddress) {
    return async () => {
        try {
            const gasPrice = await web3.eth.getGasPrice();
            const balance = await web3.eth.getBalance(account);
            const gas = 21000;
            if (unit === "WEI" && (!Number.isInteger(value) || value <= 0)) {
                message.error("金额输入有误");
                return;
            } else if (unit === "ETH" && value <= 0) {
                message.error("金额输入有误");
                return;
            }
            if (account && address) {
                if (chainId !== '0x5') {
                    message.error("请切换到Goerli测试网络");
                    return;
                }
                if (!web3.utils.isAddress(address)) {
                    message.error("请输入正确的地址");
                    return;
                }
                if (unit === "ETH") {
                    value = web3.utils.toWei(value.toString(), "ether");
                }
                if (!hasEnoughBalance(balance, value, gas, gasPrice)) {
                    message.error("余额不足");
                    return;
                }
                web3.eth.sendTransaction({
                    from: account,
                    to: address,
                    value,
                    gasPrice,
                    gas
                }, (err, transactionAddress) => {
                    if (err) {
                        message.error(err.message);
                    } else {
                        setTransactionAddress(transactionAddress);
                        setIsModalOpen(true);
                        message.success("已发起交易");
                    }
                }).then((res) => {
                    console.log(res)
                    message.success("交易成功");
                });
            } else {
                message.error("输入错误");
            }
        } catch (e) {
            message.error(e.message);
        }
    }
}


export function hasEnoughBalance(balance, value, gas, gasPrice) {
    return (BigInt(balance) >= BigInt(value) + BigInt(gasPrice) * BigInt(gas))
}