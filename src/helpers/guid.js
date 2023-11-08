import Guid from "guid";

const generateGuid = () => {
    const guid = Guid.create();

    return guid.value;
}

export default generateGuid;