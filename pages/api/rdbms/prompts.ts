import { NextApiRequest, NextApiResponse } from 'next';

import { RDBMSFolder, RDBMSPrompt, RDBMSUser } from '../../../types/rdbms';
import { OpenAIModelID, OpenAIModels } from '@/types/openai';
import { Prompt } from '@/types/prompt';

import { getDataSource } from './dataSource';

import { DataSource } from 'typeorm';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO get user from bearer token

  const user = new RDBMSUser();
  user.user_id = 'test_user';

  let body: any | null = null;
  if (req.body !== '') {
    body = JSON.parse(req.body);
  }

  const dataSource = await getDataSource();

  if (req.method === 'POST') {
    return await rdbmsGetAllPrompts(res, dataSource, user);
  } else if (req.method === 'PUT') {
    const updatedPrompts = body;
    if (body !== null) {
      return await rdbmsUpdateAllPrompts(res, dataSource, user, updatedPrompts);
    } else {
      return res.status(400).json({ error: 'No Prompts provided' });
    }
  } else if (req.method === 'DELETE') {
    return await rdbmsDeleteAllPrompts(res, user);
  } else {
    return res.status(400).json({ error: 'Method not supported' });
  }
};

const rdbmsGetAllPrompts = async (
  res: NextApiResponse,
  dataSource: DataSource,
  user: RDBMSUser,
) => {
  const promptRepo = dataSource.getRepository(RDBMSPrompt);
  const rdbmsPrompts = await promptRepo.find({
    where: { user: user },
    relations: ['folder'],
  });

  const prompts: Prompt[] = [];

  for (const rdbmsPrompt of rdbmsPrompts) {
    const model_id = rdbmsPrompt.model_id as keyof typeof OpenAIModelID;

    const model = (OpenAIModels as any)[model_id];

    let prompt: Prompt = {
      id: rdbmsPrompt.id,
      name: rdbmsPrompt.name,
      description: rdbmsPrompt.description,
      content: rdbmsPrompt.content,
      model: model,
      folderId: rdbmsPrompt.folder !== null ? rdbmsPrompt.folder.id : null,
    };

    prompts.push(prompt);
  }
  return res.status(200).json(prompts);
};

const rdbmsUpdateAllPrompts = async (
  res: NextApiResponse,
  dataSource: DataSource,
  user: RDBMSUser,
  updatedPrompts: Prompt[],
) => {
  const rdbmsPrompts: RDBMSPrompt[] = [];
  const promptRepo = dataSource.getRepository(RDBMSPrompt);
  const folderRepo = dataSource.getRepository(RDBMSFolder);

  for (const prompt of updatedPrompts) {
    const rdbmsPrompt = new RDBMSPrompt();

    rdbmsPrompt.user = user;
    rdbmsPrompt.id = prompt.id;
    rdbmsPrompt.name = prompt.name;
    rdbmsPrompt.description = prompt.description;
    rdbmsPrompt.content = prompt.content;
    rdbmsPrompt.model_id = prompt.model.id;

    if (prompt.folderId !== null) {
      const updatedFolder = await folderRepo.findOneBy({
        id: prompt.folderId,
      });

      if (updatedFolder !== null) {
        rdbmsPrompt.folder = updatedFolder;
      }
    } else {
      rdbmsPrompt.folder = null;
    }

    rdbmsPrompts.push(rdbmsPrompt);
  }

  await promptRepo.save(rdbmsPrompts);
  return res.status(200).json({
    OK: true,
  });
};

const rdbmsDeleteAllPrompts = async (res: NextApiResponse, user: RDBMSUser) => {
  const dataSource = await getDataSource();
  const promptRepo = dataSource.getRepository(RDBMSPrompt);

  const deletedPrompts = await promptRepo.findBy({
    user: user,
  });

  await promptRepo.remove(deletedPrompts);

  return res.status(200).json({
    OK: true,
  });
};

export default handler;
