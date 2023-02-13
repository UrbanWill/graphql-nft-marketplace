jest.mock("../../logger/createLogger");
import { createLogger } from "../../logger/createLogger";

// Mock logger props
const loggerDebugMock = jest.fn();
const loggerInfoMock = jest.fn();
const loggerWarnMock = jest.fn();
const loggerErrorMock = jest.fn();
const loggerMemoryUsageMock = jest.fn();

const loggerMock = jest.fn().mockImplementation(() => {
  return {
    debug: loggerDebugMock,
    info: loggerInfoMock,
    warn: loggerWarnMock,
    error: loggerErrorMock,
    logMemoryUsage: loggerMemoryUsageMock,
  };
});

const createLoggerMock = jest.mocked(createLogger);
createLoggerMock.mockImplementation(loggerMock);

export {
  loggerDebugMock,
  loggerInfoMock,
  loggerWarnMock,
  loggerErrorMock,
  createLoggerMock,
};
