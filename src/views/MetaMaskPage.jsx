import {useMetaMask} from "metamask-react";
import "../assets/style/metaMask.scss"
import {useEffect, useState} from "react";
import {initMetaMask, startTransfer, switchToGoerli} from "@/utils/metaMaskUtils";
import {Badge, Button, Descriptions, Input, InputNumber, message, Select, Space} from "antd";
import dayjs from "dayjs";
import MetaMaskModal from "@/components/MetaMaskModal";

const statusIcon = {
    connected: <Badge status="success" text="连接正常"/>,
    connecting: <Badge status="processing" text="正在连接"/>,
    disconnected: <Badge status="error" text="断开连接"/>,
    unavailable: <Badge status="error" text="不可用"/>,
}

export default function MetaMask() {
    const metaMask = useMetaMask();
    const {status, account, chainId} = metaMask;

    const [web3, setWeb3] = useState(null);//web3实例
    const [transferValue, setTransferValue] = useState(0);//转账金额
    const [transferAddress, setTransferAddress] = useState(null);//转账地址
    const [balance, setBalance] = useState(0)//余额
    const [lastUpdated, setLastUpdated] = useState(+new Date())//最后更新时间
    const [refresh, setRefresh] = useState(true)//刷新
    const [isModalOpen, setIsModalOpen] = useState(false)//弹窗
    const [transactionAddress, setTransactionAddress] = useState(null)//交易地址
    const [transactionResult, setTransactionResult] = useState(null)//交易结果
    const [unit, setUnit] = useState('WEI')//单位
    const [nodeVersion, setNodeVersion] = useState('undefined')//节点版本
    const [transactionIsPending, setTransactionIsPending] = useState(false)//交易是否正在进行

    const selectAfter = (
        <Select value={unit} onChange={(e) => setUnit(e)}>
            <Option value="ETH">ETH</Option>3
            <Option value="WEI">WEI</Option>
        </Select>
    );

    useEffect(() => {
        initMetaMask(metaMask, setWeb3, setBalance, setLastUpdated, setNodeVersion).catch(e => {
            message.error(e.message)
        })
    }, [status, refresh, chainId])
    return (<div className={"metaMaskContainer"}>
        <Descriptions title="账户信息">
            <Descriptions.Item label="登录状态">{statusIcon[status]}</Descriptions.Item>
            <Descriptions.Item label="账户地址">{account}</Descriptions.Item>
            <Descriptions.Item label="余额">{web3?.utils.fromWei(balance)} ETH</Descriptions.Item>
            <Descriptions.Item label="网络类型">{chainId}</Descriptions.Item>
            <Descriptions.Item label="数据更新于">{dayjs(lastUpdated).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="MetaMask版本">{nodeVersion}
            </Descriptions.Item>
        </Descriptions>
        <br/>
        <Space size={'large'} direction={'vertical'}>
            <Space>
                金额：
                <InputNumber onChange={(e) => setTransferValue(e)} addonAfter={unit} defaultValue={1}
                             addonBefore={selectAfter}
                             value={transferValue}/>
                地址：<Input value={transferAddress} onInput={(e) => setTransferAddress(e.target.value)}/>
                <Button type={"primary"}
                        onClick={
                            startTransfer(metaMask, web3, transferValue, transferAddress,
                                unit, setIsModalOpen, setTransactionAddress, setTransactionResult,
                                setTransactionIsPending)
                        }>转账</Button>
            </Space>
            <p style={{fontSize: "smaller", textAlign: "right"}}>*注：1 ETH=10^18 WEI</p>
            <Space>
                <Button type={"primary"} onClick={() => setRefresh(pre => !pre)}>刷新状态</Button>
                <Button type={"primary"} onClick={switchToGoerli(metaMask)}>切换至Goerli测试网络</Button>
            </Space>
        </Space>
        <MetaMaskModal transactionAddress={transactionAddress} isModalOpen={isModalOpen}
                       setIsModalOpen={setIsModalOpen} transactionResult={transactionResult}
                       transactionIsPending={transactionIsPending}/>
    </div>)
}
