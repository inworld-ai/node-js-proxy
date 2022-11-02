// @ts-check
import express from 'express';

import inworldConnector from './inworld'

async function initConnectors(service: any) {

  await inworldConnector(service)

}

export default initConnectors
