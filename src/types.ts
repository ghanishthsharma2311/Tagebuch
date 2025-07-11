interface DiaryEntry{
    id : number;
    title:string;
    createdAt: Date;
    text:string;
    isImportant:boolean
    tags: string[];   //adding tags  
    
}

export default DiaryEntry