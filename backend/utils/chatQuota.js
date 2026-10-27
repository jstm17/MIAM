const ChatQuota = require("../models/ChatQuota");

const DEFAULT_MONTHLY_LIMIT = 100000;

const monthlyLimit = () => {
  const configured = Number(process.env.CHAT_MONTHLY_TOKEN_LIMIT);
  if (Number.isFinite(configured) && configured >= 0) return Math.round(configured);
  return DEFAULT_MONTHLY_LIMIT;
};

const parisCalendar = (date = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
  };
};

const formatResetDate = (year, month) => {
  const label = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(Date.UTC(year, month - 1, 1, 12)));

  return label.replace(/^1 /, "1er ");
};

const currentQuotaPeriod = (date = new Date()) => {
  const { year, month } = parisCalendar(date);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return {
    period: `${year}-${String(month).padStart(2, "0")}`,
    resetLabel: formatResetDate(nextYear, nextMonth),
  };
};

const quotaExceededMessage = (resetLabel) =>
  `Tous les tokens ont été utilisés. Ils seront réinitialisés le ${resetLabel}.`;

const getQuota = async (date = new Date()) => {
  const { period, resetLabel } = currentQuotaPeriod(date);
  const quota = await ChatQuota.findOneAndUpdate(
    { period },
    { $setOnInsert: { tokensUsed: 0 } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  return {
    period,
    resetLabel,
    tokensUsed: quota.tokensUsed,
    limit: monthlyLimit(),
  };
};

const canUseModel = (quota) => quota.tokensUsed < quota.limit;

const addTokensUsed = async (period, tokens) => {
  const amount = Number(tokens);
  if (!Number.isFinite(amount) || amount <= 0) return;
  await ChatQuota.updateOne({ period }, { $inc: { tokensUsed: Math.round(amount) } });
};

module.exports = {
  getQuota,
  canUseModel,
  addTokensUsed,
  quotaExceededMessage,
  currentQuotaPeriod,
};
